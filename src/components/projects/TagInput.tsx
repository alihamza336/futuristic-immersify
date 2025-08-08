import { useState, KeyboardEvent } from 'react'
import { X, Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  disabled?: boolean
}

export function TagInput({
  tags,
  onChange,
  placeholder = "Type and press Enter to add tags...",
  maxTags = 20,
  disabled = false
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const addTag = (tagText: string) => {
    const trimmedTag = tagText.trim().toLowerCase()
    
    if (!trimmedTag || trimmedTag.length > 50) return
    if (tags.includes(trimmedTag)) return
    if (tags.length >= maxTags) return

    onChange([...tags, trimmedTag])
    setInputValue('')
  }

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1)
    } else if (e.key === ',' || e.key === ' ') {
      e.preventDefault()
      if (inputValue.trim()) {
        addTag(inputValue)
      }
    }
  }

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 bg-background/50 border border-border/50 rounded-md focus-within:border-brand-primary/50 transition-colors">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="bg-brand-primary/10 text-brand-primary border-brand-primary/30 pl-2 pr-1 py-1 flex items-center gap-1"
          >
            <span className="text-xs">{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              disabled={disabled}
              className="hover:bg-brand-primary/20 rounded-sm p-0.5 transition-colors"
              aria-label={`Remove ${tag} tag`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        {tags.length < maxTags && (
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            placeholder={tags.length === 0 ? placeholder : ""}
            disabled={disabled}
            className="flex-1 min-w-[120px] border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
          />
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Tag className="h-3 w-3" />
          <span>
            Press Enter, comma, or space to add tags
          </span>
        </div>
        <span>
          {tags.length}/{maxTags}
        </span>
      </div>
    </div>
  )
}