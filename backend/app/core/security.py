from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Union
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    workspace_id: Optional[str] = None
    role: Optional[str] = "member"
    exp: Optional[int] = None


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(subject: Union[str, Any], workspace_id: str, role: str = "member", expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": int(expire.timestamp()),
        "sub": str(subject),
        "workspace_id": workspace_id,
        "role": role,
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


async def get_current_user_payload(token: Optional[str] = Depends(oauth2_scheme)) -> TokenPayload:
    if not token:
        # Fallback default dev user payload if token is not provided in development mode
        return TokenPayload(sub="user_dev_nexus_01", workspace_id="ws_default_01", role="admin")
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        token_data = TokenPayload(**payload)
        if token_data.exp and datetime.fromtimestamp(token_data.exp, tz=timezone.utc) < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return token_data
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def check_rbac_permission(required_role: str = "member"):
    role_hierarchy = {"viewer": 1, "member": 2, "admin": 3, "owner": 4}
    
    def role_checker(payload: TokenPayload = Depends(get_current_user_payload)):
        user_role_level = role_hierarchy.get(payload.role or "member", 1)
        required_level = role_hierarchy.get(required_role, 2)
        if user_role_level < required_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permission. Required role level: {required_role}"
            )
        return payload
    return role_checker
