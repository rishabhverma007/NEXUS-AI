from typing import Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.db import get_db
from app.core.security import (
    get_password_hash, verify_password, create_access_token,
    get_current_user_payload, TokenPayload
)
from app.models.domain import User, Workspace
from app.models.schemas import UserCreate, UserResponse, Token

router = APIRouter(prefix="/auth", tags=["Authentication & User Management"])


@router.post("/register", response_model=Token)
async def register_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    """Register a new enterprise user and return a JWT access token."""
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == user_in.email))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Please sign in instead.",
        )

    # Create new user
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        avatar_url=user_in.avatar_url,
        is_active=True,
    )
    db.add(user)
    await db.flush()

    # Check if user's personal workspace exists, if not create one
    ws_slug = f"ws-{user.id[:8]}"
    result = await db.execute(select(Workspace).where(Workspace.slug == ws_slug))
    workspace = result.scalar_one_or_none()
    if not workspace:
        workspace = Workspace(
            name=f"{user.full_name}'s Workspace",
            slug=ws_slug,
            description=f"Personal workspace for {user.full_name}",
            owner_id=user.id,
        )
        db.add(workspace)
        await db.flush()

    # Generate JWT token
    access_token = create_access_token(
        subject=user.id,
        workspace_id=workspace.id,
        role="admin",
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        workspace_id=workspace.id,
        user=UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            avatar_url=user.avatar_url,
            is_active=user.is_active,
            created_at=user.created_at,
        ),
    )


class LoginRequest(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., description="User password")


@router.post("/login", response_model=Token)
async def login_user(
    login_in: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    """Authenticate a user and return a JWT access token."""
    result = await db.execute(select(User).where(User.email == login_in.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials and try again.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Contact your enterprise administrator.",
        )

    # Get user's primary workspace
    result = await db.execute(
        select(Workspace).where(Workspace.owner_id == user.id)
    )
    workspace = result.scalar_one_or_none()

    # Fallback to default workspace
    workspace_id = workspace.id if workspace else "ws_default_01"

    # Generate JWT token
    access_token = create_access_token(
        subject=user.id,
        workspace_id=workspace_id,
        role="admin",
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        workspace_id=workspace_id,
        user=UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            avatar_url=user.avatar_url,
            is_active=user.is_active,
            created_at=user.created_at,
        ),
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    db: AsyncSession = Depends(get_db),
    token_payload: TokenPayload = Depends(get_current_user_payload),
):
    """Fetch the authenticated user's profile."""
    user_id = token_payload.sub
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found.",
        )

    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        avatar_url=user.avatar_url,
        is_active=user.is_active,
        created_at=user.created_at,
    )
