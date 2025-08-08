import { useState, useCallback } from 'react'
import { Search, Filter, SortDesc, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { FuturisticButton } from '@/components/FuturisticButton'

export interface FilterState {
  query: string
  status: string[]
  serviceType: string[]
  tags: string[]
  sort: string
}

interface FiltersBarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  availableTags: string[]
  onCreateProject: () => void
}

const statusOptions = [
  'Draft',
  'In Progress', 
  'Blocked',
  'Review',
  'Completed'
]

const serviceTypeOptions = [
  'AR',
  'VR',
  'Gaming'
]

const sortOptions = [
  { value: 'created_at_desc', label: 'Newest First' },
  { value: 'created_at_asc', label: 'Oldest First' },
  { value: 'title_asc', label: 'A to Z' },
  { value: 'title_desc', label: 'Z to A' },
  { value: 'progress_desc', label: 'Progress High to Low' },
  { value: 'progress_asc', label: 'Progress Low to High' },
  { value: 'updated_at_desc', label: 'Recently Updated' }
]

export function FiltersBar({
  filters,
  onFiltersChange,
  availableTags,
  onCreateProject
}: FiltersBarProps) {
  const [searchValue, setSearchValue] = useState(filters.query)

  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates })
  }, [filters, onFiltersChange])

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
    // Debounce search
    const timeoutId = setTimeout(() => {
      updateFilters({ query: value })
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [updateFilters])

  const toggleArrayFilter = useCallback((
    filterKey: keyof Pick<FilterState, 'status' | 'serviceType' | 'tags'>,
    value: string
  ) => {
    const currentArray = filters[filterKey]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateFilters({ [filterKey]: newArray })
  }, [filters, updateFilters])

  const clearAllFilters = useCallback(() => {
    setSearchValue('')
    onFiltersChange({
      query: '',
      status: [],
      serviceType: [],
      tags: [],
      sort: 'created_at_desc'
    })
  }, [onFiltersChange])

  const hasActiveFilters = 
    filters.query || 
    filters.status.length > 0 || 
    filters.serviceType.length > 0 || 
    filters.tags.length > 0

  const totalActiveFilters = 
    filters.status.length + 
    filters.serviceType.length + 
    filters.tags.length

  return (
    <div className="bg-card/20 backdrop-blur-lg border border-border/50 rounded-lg p-4 space-y-4">
      {/* Search and Create Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-background/50 border-border/50 focus:border-brand-primary/50"
          />
        </div>
        <FuturisticButton 
          onClick={onCreateProject}
          variant="hero"
          className="shrink-0"
        >
          New Project
        </FuturisticButton>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="border-border/50 bg-background/50 hover:border-brand-primary/50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Status
              {filters.status.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {filters.status.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3">
            <div className="space-y-2">
              <div className="font-orbitron font-medium text-sm">Project Status</div>
              {statusOptions.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.status.includes(status)}
                    onCheckedChange={() => toggleArrayFilter('status', status)}
                  />
                  <label
                    htmlFor={`status-${status}`}
                    className="text-sm cursor-pointer"
                  >
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Service Type Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="border-border/50 bg-background/50 hover:border-brand-primary/50"
            >
              Service Type
              {filters.serviceType.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {filters.serviceType.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3">
            <div className="space-y-2">
              <div className="font-orbitron font-medium text-sm">Service Type</div>
              {serviceTypeOptions.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`service-${type}`}
                    checked={filters.serviceType.includes(type)}
                    onCheckedChange={() => toggleArrayFilter('serviceType', type)}
                  />
                  <label
                    htmlFor={`service-${type}`}
                    className="text-sm cursor-pointer"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Tags Filter */}
        {availableTags.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="border-border/50 bg-background/50 hover:border-brand-primary/50"
              >
                Tags
                {filters.tags.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                    {filters.tags.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 max-h-80 overflow-y-auto">
              <div className="space-y-2">
                <div className="font-orbitron font-medium text-sm">Tags</div>
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={filters.tags.includes(tag)}
                      onCheckedChange={() => toggleArrayFilter('tags', tag)}
                    />
                    <label
                      htmlFor={`tag-${tag}`}
                      className="text-sm cursor-pointer truncate"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Sort */}
        <Select value={filters.sort} onValueChange={(value) => updateFilters({ sort: value })}>
          <SelectTrigger className="w-48 border-border/50 bg-background/50 focus:border-brand-primary/50">
            <SortDesc className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
          {filters.query && (
            <Badge variant="outline" className="bg-brand-primary/10 text-brand-primary border-brand-primary/30">
              Search: "{filters.query}"
              <button
                onClick={() => {
                  setSearchValue('')
                  updateFilters({ query: '' })
                }}
                className="ml-1 hover:bg-brand-primary/20 rounded"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.status.map((status) => (
            <Badge key={status} variant="outline" className="bg-secondary/50">
              Status: {status}
              <button
                onClick={() => toggleArrayFilter('status', status)}
                className="ml-1 hover:bg-secondary rounded"
                aria-label={`Remove ${status} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {filters.serviceType.map((type) => (
            <Badge key={type} variant="outline" className="bg-secondary/50">
              Type: {type}
              <button
                onClick={() => toggleArrayFilter('serviceType', type)}
                className="ml-1 hover:bg-secondary rounded"
                aria-label={`Remove ${type} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {filters.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="bg-secondary/50">
              Tag: {tag}
              <button
                onClick={() => toggleArrayFilter('tags', tag)}
                className="ml-1 hover:bg-secondary rounded"
                aria-label={`Remove ${tag} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}