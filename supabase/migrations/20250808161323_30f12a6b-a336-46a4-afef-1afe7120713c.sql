-- Fix the infinite recursion in project_members RLS policy
-- The issue is that the policy references project_members within its own policy definition

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view members of projects they have access to" ON public.project_members;

-- Create a security definer function to check project access without recursion
CREATE OR REPLACE FUNCTION public.can_access_project(project_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  -- Check if user is project owner
  SELECT EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_id_param AND owner_id = auth.uid()
  )
  OR
  -- Check if user is a project member (using direct query to avoid recursion)
  EXISTS (
    SELECT 1 FROM public.project_members 
    WHERE project_id = project_id_param AND user_id = auth.uid()
  );
$$;

-- Recreate the policy using the security definer function
CREATE POLICY "Users can view members of projects they have access to"
ON public.project_members
FOR SELECT
USING (public.can_access_project(project_id));

-- Also fix the projects RLS policy to avoid potential recursion
DROP POLICY IF EXISTS "Users can view projects they own or are members of" ON public.projects;

CREATE POLICY "Users can view projects they own or are members of"
ON public.projects
FOR SELECT
USING (
  owner_id = auth.uid() 
  OR 
  EXISTS (
    SELECT 1 FROM public.project_members pm 
    WHERE pm.project_id = projects.id AND pm.user_id = auth.uid()
  )
);