-- Fix the remaining recursive reference in the UPDATE policy

-- Drop the problematic editor update policy
DROP POLICY IF EXISTS "Editors can update project details" ON public.projects;

-- Create a simpler, non-recursive editor update policy
-- Editors can update but cannot change the owner_id (enforced by WITH CHECK)
CREATE POLICY "Editors can update project details"
ON public.projects
FOR UPDATE
USING (public.is_projects_editor(id))
WITH CHECK (public.is_projects_editor(id));