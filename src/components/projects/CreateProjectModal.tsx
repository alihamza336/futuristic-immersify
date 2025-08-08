import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TagInput } from './TagInput'
import { FuturisticButton } from '@/components/FuturisticButton'

interface CreateProjectModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateProjectData) => Promise<void>
  isLoading?: boolean
}

export interface CreateProjectData {
  title: string
  summary: string
  service_type: 'AR' | 'VR' | 'Gaming'
  tags: string[]
}

export function CreateProjectModal({
  open,
  onClose,
  onSubmit,
  isLoading = false
}: CreateProjectModalProps) {
  const [formData, setFormData] = useState<CreateProjectData>({
    title: '',
    summary: '',
    service_type: 'AR',
    tags: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await onSubmit(formData)
      // Reset form
      setFormData({
        title: '',
        summary: '',
        service_type: 'AR',
        tags: []
      })
      setErrors({})
      onClose()
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        title: '',
        summary: '',
        service_type: 'AR',
        tags: []
      })
      setErrors({})
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-lg border-border/50">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-xl brand-gradient">
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-orbitron">
              Project Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, title: e.target.value }))
                if (errors.title) setErrors(prev => ({ ...prev, title: '' }))
              }}
              placeholder="Enter project title..."
              className="bg-background/50 border-border/50 focus:border-brand-primary/50"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary" className="font-orbitron">
              Summary
            </Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Brief description of the project..."
              rows={3}
              className="bg-background/50 border-border/50 focus:border-brand-primary/50 resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Service Type */}
          <div className="space-y-2">
            <Label className="font-orbitron">Service Type</Label>
            <Select
              value={formData.service_type}
              onValueChange={(value: 'AR' | 'VR' | 'Gaming') => 
                setFormData(prev => ({ ...prev, service_type: value }))
              }
              disabled={isLoading}
            >
              <SelectTrigger className="bg-background/50 border-border/50 focus:border-brand-primary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AR">Augmented Reality</SelectItem>
                <SelectItem value="VR">Virtual Reality</SelectItem>
                <SelectItem value="Gaming">Gaming</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="font-orbitron">Tags</Label>
            <TagInput
              tags={formData.tags}
              onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
              placeholder="Add tags to organize your project..."
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="border-border/50 hover:border-border"
            >
              Cancel
            </Button>
            <FuturisticButton
              type="submit"
              disabled={isLoading}
              variant="hero"
            >
              {isLoading ? 'Creating...' : 'Create Project'}
            </FuturisticButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}