-- ====================================================================
-- NEXUS AI — Enterprise Multi-Tenant Database Schema & Supabase RLS Policies
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  timezone VARCHAR(100) DEFAULT 'UTC',
  language VARCHAR(50) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 2. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT,
  industry VARCHAR(100),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 3. ORGANIZATION MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'member', -- owner, admin, member
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, profile_id)
);

-- 4. WORKSPACES TABLE
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100) DEFAULT 'Database',
  color VARCHAR(50) DEFAULT 'blue',
  owner_id UUID NOT NULL REFERENCES public.profiles(id),
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(organization_id, slug)
);

-- 5. WORKSPACE MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'editor', -- owner, admin, editor, viewer, guest
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, profile_id)
);

-- 6. ROLES & PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.roles (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id VARCHAR(100) PRIMARY KEY,
  description TEXT
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id VARCHAR(50) REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id VARCHAR(100) REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 7. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  actor_id UUID NOT NULL REFERENCES public.profiles(id),
  event_type VARCHAR(100) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  browser VARCHAR(100),
  os VARCHAR(100),
  ip_address VARCHAR(45),
  country VARCHAR(100),
  is_current BOOLEAN DEFAULT FALSE,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. API KEYS TABLE
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_prefix VARCHAR(20) NOT NULL,
  secret_hash VARCHAR(255) NOT NULL,
  scopes JSONB DEFAULT '[]'::jsonb,
  expires_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 10. FEATURE FLAGS TABLE
CREATE TABLE IF NOT EXISTS public.feature_flags (
  key VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  environment VARCHAR(50) DEFAULT 'production', -- experimental, beta, production, internal
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles in their org, edit only own profile
CREATE POLICY "Read profiles in same org" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Workspaces: Users can only select workspaces they are members of
CREATE POLICY "Select member workspaces" ON public.workspaces
  FOR SELECT USING (
    id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

-- Audit Logs: Workspace members can view audit logs
CREATE POLICY "Select workspace audit logs" ON public.audit_logs
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_wm_workspace_profile ON public.workspace_members(workspace_id, profile_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_org ON public.workspaces(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_workspace ON public.audit_logs(workspace_id, created_at DESC);
