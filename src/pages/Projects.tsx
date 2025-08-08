import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { ProjectCard, type Project } from '@/components/projects/ProjectCard'
import { FiltersBar, type FilterState } from '@/components/projects/FiltersBar'
import { ProjectsPagination } from '@/components/projects/ProjectsPagination'
import { CreateProjectModal, type CreateProjectData } from '@/components/projects/CreateProjectModal'
import { ConfirmModal } from '@/components/projects/ConfirmModal'
import { FuturisticButton } from '@/components/FuturisticButton'
import { Archive, Trash2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Projects() {
  const { user } = useAuth()
  const { toast } = useToast()

  // State
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [availableTags, setAvailableTags] = useState<string[]>([])

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    status: [],
    serviceType: [],
    tags: [],
    sort: 'created_at_desc'
  })

  // Selection for bulk actions
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
  const [bulkMode, setBulkMode] = useState(false)

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: 'archive' | 'delete' | 'bulk-archive' | 'bulk-delete'
    project?: Project
    isOpen: boolean
  }>({ type: 'archive', isOpen: false })

  // Computed values
  const totalPages = Math.ceil(totalCount / pageSize)
  const hasSelectedProjects = selectedProjects.size > 0

  // Fetch projects with filters and pagination
  const fetchProjects = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      
      let query = supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .eq('owner_id', user.id)

      // Apply filters
      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,summary.ilike.%${filters.query}%`)
      }

      if (filters.status.length > 0) {
        query = query.in('status', filters.status as any)
      }

      if (filters.serviceType.length > 0) {
        query = query.in('service_type', filters.serviceType as any)
      }

      if (filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags)
      }

      // Apply sorting
      const [sortField, sortDirection] = filters.sort.split('_')
      const ascending = sortDirection === 'asc'
      query = query.order(sortField, { ascending })

      // Apply pagination
      const from = (currentPage - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        throw error
      }

      setProjects(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [user, filters, currentPage, pageSize, toast])

  // Fetch available tags
  const fetchAvailableTags = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('tags')
        .eq('owner_id', user.id)

      if (error) throw error

      const allTags = new Set<string>()
      data?.forEach(project => {
        project.tags?.forEach((tag: string) => allTags.add(tag))
      })
      
      setAvailableTags(Array.from(allTags).sort())
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }, [user])

  // Effects
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    fetchAvailableTags()
  }, [fetchAvailableTags])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
    setSelectedProjects(new Set())
  }, [filters])

  // Create project
  const handleCreateProject = async (data: CreateProjectData) => {
    if (!user) return

    try {
      setCreating(true)
      
      const { error } = await supabase
        .from('projects')
        .insert({
          ...data,
          owner_id: user.id,
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Project created successfully",
      })

      fetchProjects()
      fetchAvailableTags()
    } catch (error) {
      console.error('Error creating project:', error)
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      })
      throw error
    } finally {
      setCreating(false)
    }
  }

  // Project actions
  const handleEditProject = (project: Project) => {
    // Navigate to project detail page
    window.location.href = `/dashboard/projects/${project.id}`
  }

  const handleDuplicateProject = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          title: `${project.title} (Copy)`,
          summary: project.summary,
          service_type: project.service_type,
          tags: project.tags,
          owner_id: user!.id,
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Project duplicated successfully",
      })

      fetchProjects()
    } catch (error) {
      console.error('Error duplicating project:', error)
      toast({
        title: "Error",
        description: "Failed to duplicate project",
        variant: "destructive",
      })
    }
  }

  const handleArchiveProject = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_archived: !project.is_archived })
        .eq('id', project.id)

      if (error) throw error

      toast({
        title: "Success",
        description: `Project ${project.is_archived ? 'unarchived' : 'archived'} successfully`,
      })

      fetchProjects()
    } catch (error) {
      console.error('Error archiving project:', error)
      toast({
        title: "Error",
        description: `Failed to ${project.is_archived ? 'unarchive' : 'archive'} project`,
        variant: "destructive",
      })
    }
  }

  const handleDeleteProject = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Project deleted successfully",
      })

      fetchProjects()
      fetchAvailableTags()
    } catch (error) {
      console.error('Error deleting project:', error)
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    }
  }

  // Bulk actions
  const handleBulkArchive = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_archived: true })
        .in('id', Array.from(selectedProjects))

      if (error) throw error

      toast({
        title: "Success",
        description: `${selectedProjects.size} projects archived successfully`,
      })

      setSelectedProjects(new Set())
      setBulkMode(false)
      fetchProjects()
    } catch (error) {
      console.error('Error bulk archiving:', error)
      toast({
        title: "Error",
        description: "Failed to archive projects",
        variant: "destructive",
      })
    }
  }

  const handleBulkDelete = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .in('id', Array.from(selectedProjects))

      if (error) throw error

      toast({
        title: "Success",
        description: `${selectedProjects.size} projects deleted successfully`,
      })

      setSelectedProjects(new Set())
      setBulkMode(false)
      fetchProjects()
      fetchAvailableTags()
    } catch (error) {
      console.error('Error bulk deleting:', error)
      toast({
        title: "Error",
        description: "Failed to delete projects",
        variant: "destructive",
      })
    }
  }

  // Selection handlers
  const handleSelectProject = (project: Project, selected: boolean) => {
    const newSelection = new Set(selectedProjects)
    if (selected) {
      newSelection.add(project.id)
    } else {
      newSelection.delete(project.id)
    }
    setSelectedProjects(newSelection)
  }

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedProjects(new Set(projects.map(p => p.id)))
    } else {
      setSelectedProjects(new Set())
    }
  }

  // Confirm action handlers
  const handleConfirmAction = () => {
    switch (confirmAction.type) {
      case 'archive':
        if (confirmAction.project) handleArchiveProject(confirmAction.project)
        break
      case 'delete':
        if (confirmAction.project) handleDeleteProject(confirmAction.project)
        break
      case 'bulk-archive':
        handleBulkArchive()
        break
      case 'bulk-delete':
        handleBulkDelete()
        break
    }
  }

  const getConfirmText = () => {
    switch (confirmAction.type) {
      case 'archive':
        return confirmAction.project?.is_archived ? 'Unarchive' : 'Archive'
      case 'delete':
        return 'Delete'
      case 'bulk-archive':
        return 'Archive All'
      case 'bulk-delete':
        return 'Delete All'
      default:
        return 'Confirm'
    }
  }

  const getConfirmTitle = () => {
    switch (confirmAction.type) {
      case 'archive':
        return confirmAction.project?.is_archived ? 'Unarchive project?' : 'Archive project?'
      case 'delete':
        return 'Delete project permanently?'
      case 'bulk-archive':
        return `Archive ${selectedProjects.size} projects?`
      case 'bulk-delete':
        return `Delete ${selectedProjects.size} projects permanently?`
      default:
        return 'Confirm action?'
    }
  }

  const getConfirmDescription = () => {
    switch (confirmAction.type) {
      case 'archive':
        return confirmAction.project?.is_archived 
          ? 'This will restore the project to your active projects.'
          : 'This will hide the project from your active projects. You can restore it later.'
      case 'delete':
        return 'This action cannot be undone. All project data, notes, and activity will be permanently removed.'
      case 'bulk-archive':
        return 'This will archive all selected projects. You can restore them later.'
      case 'bulk-delete':
        return 'This action cannot be undone. All selected projects and their data will be permanently removed.'
      default:
        return 'Are you sure you want to continue?'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background particles gradient-mesh">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5" />
        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground/60 font-orbitron">Loading projects...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background particles gradient-mesh">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-brand rounded-full opacity-5 blur-3xl floating" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-glow rounded-full opacity-10 blur-2xl floating" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-title font-orbitron brand-gradient mb-2">
                Projects Hub
              </h1>
              <p className="text-muted-foreground">
                Manage your AR, VR, and Gaming projects
              </p>
            </div>

            {/* Bulk Actions */}
            {bulkMode && hasSelectedProjects && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmAction({ type: 'bulk-archive', isOpen: true })}
                  className="border-border/50 hover:border-border"
                >
                  <Archive className="h-4 w-4 mr-1" />
                  Archive ({selectedProjects.size})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmAction({ type: 'bulk-delete', isOpen: true })}
                  className="border-destructive/50 text-destructive hover:border-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete ({selectedProjects.size})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setBulkMode(false)
                    setSelectedProjects(new Set())
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}

            {!bulkMode && (
              <div className="flex items-center gap-2">
                {projects.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBulkMode(true)}
                    className="border-border/50 hover:border-border"
                  >
                    Select Multiple
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Bulk selection controls */}
          {bulkMode && (
            <div className="bg-card/20 backdrop-blur-lg border border-border/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedProjects.size === projects.length && projects.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded border-border bg-card text-brand-primary focus:ring-brand-primary focus:ring-2 focus:ring-offset-0"
                    />
                    <span className="font-orbitron text-sm">
                      Select All ({projects.length})
                    </span>
                  </label>
                  {hasSelectedProjects && (
                    <span className="text-sm text-muted-foreground">
                      {selectedProjects.size} selected
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <FiltersBar
          filters={filters}
          onFiltersChange={setFilters}
          availableTags={availableTags}
          onCreateProject={() => setShowCreateModal(true)}
        />

        {/* Projects Grid */}
        <div className="mt-8">
          {projects.length === 0 ? (
            <div className="bg-card/20 backdrop-blur-lg border border-border/50 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-orbitron font-semibold text-foreground mb-2">
                No projects match your filters.
              </h3>
              <p className="text-muted-foreground mb-6">
                {filters.query || filters.status.length > 0 || filters.serviceType.length > 0 || filters.tags.length > 0
                  ? "Try adjusting your search criteria or create a new project."
                  : "Create your first AR, VR, or Gaming project to get started."
                }
              </p>
              <FuturisticButton 
                onClick={() => setShowCreateModal(true)}
                variant="hero"
              >
                Create a Project
              </FuturisticButton>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={handleEditProject}
                    onDuplicate={handleDuplicateProject}
                    onArchive={(p) => setConfirmAction({ type: 'archive', project: p, isOpen: true })}
                    onDelete={(p) => setConfirmAction({ type: 'delete', project: p, isOpen: true })}
                    onSelect={handleSelectProject}
                    isSelected={selectedProjects.has(project.id)}
                    showCheckbox={bulkMode}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <ProjectsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalCount={totalCount}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(newPageSize) => {
                      setPageSize(newPageSize)
                      setCurrentPage(1)
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
        isLoading={creating}
      />

      <ConfirmModal
        open={confirmAction.isOpen}
        onClose={() => setConfirmAction(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={getConfirmTitle()}
        description={getConfirmDescription()}
        confirmText={getConfirmText()}
        isDestructive={confirmAction.type === 'delete' || confirmAction.type === 'bulk-delete'}
      />
    </div>
  )
}