-- Fix infinite recursion in projects table RLS policies
-- The issue is policies that reference the projects table within their own USING clauses

BEGIN;

-- 1) Drop all existing policies on projects table to start clean
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='projects' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.projects;', r.policyname);
  END LOOP;
END$$;

-- 2) Create security definer helper functions that avoid reading from projects table

-- Helper to check project membership (reads only project_members, NOT projects)
CREATE OR REPLACE FUNCTION public.is_projects_member(p_project_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.project_members pm
    WHERE pm.project_id = p_project_id
      AND pm.user_id = auth.uid()
  );
$$;

-- Helper to check if user has editor role on project (reads only project_members)
CREATE OR REPLACE FUNCTION public.is_projects_editor(p_project_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.project_members pm
    WHERE pm.project_id = p_project_id
      AND pm.user_id = auth.uid()
      AND pm.role = 'Editor'
  );
$$;

-- 3) Grant proper permissions on helper functions
REVOKE ALL ON FUNCTION public.is_projects_member(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_projects_member(uuid) TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_projects_editor(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_projects_editor(uuid) TO anon, authenticated, service_role;

-- 4) Create non-recursive RLS policies

-- SELECT: owners can see their projects, members can see projects they belong to
CREATE POLICY "Users can view projects they own"
ON public.projects
FOR SELECT
USING (owner_id = auth.uid());

CREATE POLICY "Users can view projects they are members of"
ON public.projects
FOR SELECT
USING (public.is_projects_member(id));

-- INSERT: only authenticated users can create projects as owners
CREATE POLICY "Users can create their own projects"
ON public.projects
FOR INSERT
WITH CHECK (owner_id = auth.uid());

-- UPDATE: owners can always update, editors can update (but not change ownership)
CREATE POLICY "Owners can update their projects"
ON public.projects
FOR UPDATE
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Editors can update project details"
ON public.projects
FOR UPDATE
USING (public.is_projects_editor(id))
WITH CHECK (
  public.is_projects_editor(id) 
  AND owner_id = (SELECT owner_id FROM public.projects WHERE id = projects.id)
);

-- DELETE: only owners can delete projects
CREATE POLICY "Only owners can delete projects"
ON public.projects
FOR DELETE
USING (owner_id = auth.uid());

COMMIT;