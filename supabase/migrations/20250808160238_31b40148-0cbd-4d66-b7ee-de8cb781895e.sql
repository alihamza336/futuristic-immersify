-- Create enum types for projects
CREATE TYPE service_type AS ENUM ('AR', 'VR', 'Gaming');
CREATE TYPE project_status AS ENUM ('Draft', 'In Progress', 'Blocked', 'Review', 'Completed');
CREATE TYPE member_role AS ENUM ('Owner', 'Editor', 'Viewer');

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  service_type service_type NOT NULL DEFAULT 'AR',
  status project_status NOT NULL DEFAULT 'Draft',
  progress SMALLINT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  tags TEXT[] DEFAULT '{}',
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create project_members table
CREATE TABLE public.project_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role member_role NOT NULL DEFAULT 'Viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Create project_notes table
CREATE TABLE public.project_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  mentions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create project_activity table
CREATE TABLE public.project_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_projects_owner_status_created ON public.projects(owner_id, status, created_at DESC);
CREATE INDEX idx_projects_tags_gin ON public.projects USING GIN(tags);
CREATE INDEX idx_project_notes_project_created ON public.project_notes(project_id, created_at DESC);
CREATE INDEX idx_project_activity_project_created ON public.project_activity(project_id, created_at DESC);
CREATE INDEX idx_project_members_project_user ON public.project_members(project_id, user_id);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_activity ENABLE ROW LEVEL SECURITY;

-- Create function to get user role in project
CREATE OR REPLACE FUNCTION public.get_user_project_role(project_id_param UUID, user_id_param UUID)
RETURNS member_role AS $$
DECLARE
  user_role member_role;
  project_owner UUID;
BEGIN
  -- Check if user is the project owner
  SELECT owner_id INTO project_owner FROM public.projects WHERE id = project_id_param;
  IF project_owner = user_id_param THEN
    RETURN 'Owner';
  END IF;
  
  -- Check if user is a member
  SELECT role INTO user_role FROM public.project_members 
  WHERE project_id = project_id_param AND user_id = user_id_param;
  
  RETURN COALESCE(user_role, NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for projects
CREATE POLICY "Users can view projects they own or are members of" 
ON public.projects FOR SELECT 
USING (
  owner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.project_members pm 
    WHERE pm.project_id = id AND pm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own projects" 
ON public.projects FOR INSERT 
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners and editors can update projects" 
ON public.projects FOR UPDATE 
USING (
  owner_id = auth.uid() OR
  public.get_user_project_role(id, auth.uid()) IN ('Editor')
);

CREATE POLICY "Only owners can delete projects" 
ON public.projects FOR DELETE 
USING (owner_id = auth.uid());

-- RLS Policies for project_members
CREATE POLICY "Users can view members of projects they have access to" 
ON public.project_members FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_id AND (
      p.owner_id = auth.uid() OR
      EXISTS (SELECT 1 FROM public.project_members pm2 WHERE pm2.project_id = p.id AND pm2.user_id = auth.uid())
    )
  )
);

CREATE POLICY "Only owners can manage project members" 
ON public.project_members FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_id AND p.owner_id = auth.uid()
  )
);

-- RLS Policies for project_notes
CREATE POLICY "Users can view notes of projects they have access to" 
ON public.project_notes FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_id AND (
      p.owner_id = auth.uid() OR
      EXISTS (SELECT 1 FROM public.project_members pm WHERE pm.project_id = p.id AND pm.user_id = auth.uid())
    )
  )
);

CREATE POLICY "Project members can create notes" 
ON public.project_notes FOR INSERT 
WITH CHECK (
  author_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_id AND (
      p.owner_id = auth.uid() OR
      EXISTS (SELECT 1 FROM public.project_members pm WHERE pm.project_id = p.id AND pm.user_id = auth.uid())
    )
  )
);

CREATE POLICY "Users can delete their own notes" 
ON public.project_notes FOR DELETE 
USING (author_id = auth.uid());

-- RLS Policies for project_activity
CREATE POLICY "Users can view activity of projects they have access to" 
ON public.project_activity FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_id AND (
      p.owner_id = auth.uid() OR
      EXISTS (SELECT 1 FROM public.project_members pm WHERE pm.project_id = p.id AND pm.user_id = auth.uid())
    )
  )
);

CREATE POLICY "System can create activity logs" 
ON public.project_activity FOR INSERT 
WITH CHECK (true);

-- Create trigger to update updated_at on projects
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to log project activity
CREATE OR REPLACE FUNCTION public.log_project_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.project_activity (project_id, actor_id, action, meta)
    VALUES (NEW.id, auth.uid(), 'project_created', jsonb_build_object('title', NEW.title));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Log status changes
    IF OLD.status != NEW.status THEN
      INSERT INTO public.project_activity (project_id, actor_id, action, meta)
      VALUES (NEW.id, auth.uid(), 'status_changed', 
        jsonb_build_object('from', OLD.status, 'to', NEW.status));
    END IF;
    -- Log progress changes
    IF OLD.progress != NEW.progress THEN
      INSERT INTO public.project_activity (project_id, actor_id, action, meta)
      VALUES (NEW.id, auth.uid(), 'progress_updated', 
        jsonb_build_object('from', OLD.progress, 'to', NEW.progress));
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for activity logging
CREATE TRIGGER log_project_activity_trigger
  AFTER INSERT OR UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.log_project_activity();

-- Trigger for member activity logging
CREATE OR REPLACE FUNCTION public.log_member_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.project_activity (project_id, actor_id, action, meta)
    VALUES (NEW.project_id, auth.uid(), 'member_added', 
      jsonb_build_object('user_id', NEW.user_id, 'role', NEW.role));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.project_activity (project_id, actor_id, action, meta)
    VALUES (NEW.project_id, auth.uid(), 'member_role_changed', 
      jsonb_build_object('user_id', NEW.user_id, 'from', OLD.role, 'to', NEW.role));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.project_activity (project_id, actor_id, action, meta)
    VALUES (OLD.project_id, auth.uid(), 'member_removed', 
      jsonb_build_object('user_id', OLD.user_id, 'role', OLD.role));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_member_activity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.project_members
  FOR EACH ROW
  EXECUTE FUNCTION public.log_member_activity();