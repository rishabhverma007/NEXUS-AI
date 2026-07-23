from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.db import get_db
from app.core.security import get_current_user_payload, TokenPayload
from app.models.domain import Workspace, User
from app.models.schemas import WorkspaceCreate, WorkspaceResponse

router = APIRouter(prefix="/workspaces", tags=["Workspace Management"])


@router.get("", response_model=List[WorkspaceResponse])
async def list_user_workspaces(
    db: AsyncSession = Depends(get_db),
    user_payload: TokenPayload = Depends(get_current_user_payload)
):
    stmt = select(Workspace)
    res = await db.execute(stmt)
    workspaces = res.scalars().all()
    if not workspaces:
        # Create default workspace if none exists
        default_ws = Workspace(
            id="ws_default_01",
            name="Nexus Enterprise Core",
            slug="nexus-enterprise-core",
            description="Default Enterprise Knowledge Workspace",
            owner_id=user_payload.sub or "user_dev_nexus_01"
        )
        db.add(default_ws)
        await db.flush()
        return [default_ws]
    return workspaces


@router.post("", response_model=WorkspaceResponse)
async def create_workspace(
    ws_in: WorkspaceCreate,
    db: AsyncSession = Depends(get_db),
    user_payload: TokenPayload = Depends(get_current_user_payload)
):
    slug = ws_in.name.lower().replace(" ", "-")
    ws = Workspace(
        name=ws_in.name,
        slug=slug,
        description=ws_in.description,
        owner_id=user_payload.sub or "user_dev_nexus_01"
    )
    db.add(ws)
    await db.flush()
    return ws
