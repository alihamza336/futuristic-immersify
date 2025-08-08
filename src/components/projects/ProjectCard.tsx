import { memo } from 'react'
import { MoreVertical, Calendar, User, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

export interface Project {
  id: string
  title: string
  summary?: string
  service_type: 'AR' | 'VR' | 'Gaming'
  status: 'Draft' | 'In Progress' | 'Blocked' | 'Review' | 'Completed'
  progress: number
  tags: string[]
  is_archived: boolean
  updated_at: string
  owner_id: string
}

interface ProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onDuplicate: (project: Project) => void
  onArchive: (project: Project) => void
  onDelete: (project: Project) => void
  onSelect?: (project: Project, selected: boolean) => void
  isSelected?: boolean
  showCheckbox?: boolean
}

const statusColors = {
  'Draft': 'bg-muted text-muted-foreground',
  'In Progress': 'bg-brand-primary/20 text-brand-primary border-brand-primary/30',
  'Blocked': 'bg-destructive/20 text-destructive border-destructive/30',
  'Review': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  'Completed': 'bg-green-500/20 text-green-500 border-green-500/30'
}

const serviceTypeColors = {
  'AR': 'bg-brand-primary/10 text-brand-primary',
  'VR': 'bg-brand-secondary/10 text-brand-secondary', 
  'Gaming': 'bg-accent/10 text-accent-foreground'
}

export const ProjectCard = memo(({
  project,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
  onSelect,
  isSelected = false,
  showCheckbox = false
}: ProjectCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const displayTags = project.tags.slice(0, 4)
  const remainingTagsCount = project.tags.length - 4

  return (
    <Card className="group relative bg-card/20 backdrop-blur-lg border-border/50 hover:border-brand-primary/30 transition-all duration-300 card-3d">
      {showCheckbox && (
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect?.(project, e.target.checked)}
            className="w-4 h-4 rounded border-border bg-card text-brand-primary focus:ring-brand-primary focus:ring-2 focus:ring-offset-0"
            aria-label={`Select ${project.title}`}
          />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-orbitron font-semibold text-foreground text-lg leading-tight truncate">
              {project.title}
            </h3>
            {project.summary && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {project.summary}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Project actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(project)}>
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(project)}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchive(project)}>
                {project.is_archived ? 'Unarchive' : 'Archive'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(project)}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Service Type & Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge 
            variant="outline" 
            className={`font-orbitron text-xs ${serviceTypeColors[project.service_type]}`}
          >
            {project.service_type}
          </Badge>
          <Badge 
            variant="outline"
            className={`font-orbitron text-xs ${statusColors[project.status]}`}
          >
            {project.status}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-orbitron text-foreground">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Tag className="h-3 w-3" />
              <span>Tags</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {displayTags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5 bg-secondary/50"
                >
                  {tag}
                </Badge>
              ))}
              {remainingTagsCount > 0 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-secondary/50">
                  +{remainingTagsCount}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Updated {formatDate(project.updated_at)}</span>
          </div>
        </div>
      </CardContent>

      {project.is_archived && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            Archived
          </Badge>
        </div>
      )}
    </Card>
  )
})

ProjectCard.displayName = 'ProjectCard'