"""
Authentication & session endpoints: register, login, and the current user.

Every registered user receives a personal workspace preloaded with the
enterprise corpus, so the product demos itself from the very first signup.
Login accepts JSON (frontend) and OAuth2 form encoding (Swagger's Authorize).
"""
import uuid

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field, field_validator
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.security import (
    DUMMY_PASSWORD_HASH,
    TokenPayload,
    create_access_token,
    get_authenticated_user_payload,
    get_password_hash,
    verify_password,
)
from app.models.domain import User, Workspace
from app.models.schemas import Token, UserResponse
from app.services.seeder import seed_corpus_for_workspace

router = APIRouter(prefix="/auth", tags=["Authentication & Sessions"])


class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=120)
    # bcrypt truncates at 72 bytes — cap the schema at that to avoid two
    # distinct long passwords silently hashing to the same value.
    password: str = Field(min_length=8, max_length=72)

    @field_validator("full_name")
    @classmethod
    def _full_name_not_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("full_name must not be blank")
        return stripped


def _slugify(text: str) -> str:
    slug = "".join(ch if ch.isalnum() else "-" for ch in text.lower()).strip("-")
    return slug or "workspace"


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register_user(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    email = req.email.lower()
    existing = (
        await db.execute(select(User).where(User.email == email))
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    user = User(
        email=email,
        full_name=req.full_name,
        hashed_password=get_password_hash(req.password),
    )
    db.add(user)
    try:
        await db.flush()
    except IntegrityError:
        # Concurrent signup with the same email won the race.
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    # Personal workspace (unique slug), preloaded with the enterprise corpus.
    ws = Workspace(
        name=f"{req.full_name}'s Workspace",
        slug=f"{_slugify(req.full_name)}-{uuid.uuid4().hex[:6]}",
        description="Personal workspace created on signup",
        owner_id=user.id,
    )
    db.add(ws)
    await db.flush()

    await seed_corpus_for_workspace(session=db, workspace_id=ws.id, owner_id=user.id)

    token = create_access_token(subject=user.id, workspace_id=ws.id, role="owner")
    return Token(access_token=token, workspace_id=ws.id, user=user)


@router.post("/login", response_model=Token)
async def login_user(request: Request, db: AsyncSession = Depends(get_db)):
    # Accept JSON (frontend) and OAuth2 form encoding (Swagger Authorize).
    content_type = request.headers.get("content-type", "")
    email = ""
    password = ""
    try:
        if "application/x-www-form-urlencoded" in content_type:
            form = await request.form()
            email = str(form.get("username", "")).strip().lower()
            password = str(form.get("password", ""))
        else:
            body = await request.json()
            if not isinstance(body, dict):
                raise ValueError("expected a JSON object")
            email = str(body.get("email", "")).strip().lower()
            password = str(body.get("password", ""))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Request body must be JSON with email and password fields",
        )

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email and password are required",
        )

    user = (
        await db.execute(select(User).where(User.email == email))
    ).scalar_one_or_none()

    # Timing-safe: unknown emails still run one bcrypt verify against a dummy
    # hash, so response time does not reveal whether the account exists.
    if not user:
        verify_password(password, DUMMY_PASSWORD_HASH)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been disabled",
        )

    # Primary workspace = the user's oldest-owned workspace.
    ws = (
        await db.execute(
            select(Workspace)
            .where(Workspace.owner_id == user.id)
            .order_by(Workspace.created_at.asc())
        )
    ).scalars().first()
    workspace_id = ws.id if ws else "ws_default_01"

    token = create_access_token(subject=user.id, workspace_id=workspace_id, role="owner")
    return Token(access_token=token, workspace_id=workspace_id, user=user)


@router.get("/me", response_model=UserResponse)
async def read_current_user(
    payload: TokenPayload = Depends(get_authenticated_user_payload),
    db: AsyncSession = Depends(get_db),
):
    user = await db.get(User, payload.sub)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
