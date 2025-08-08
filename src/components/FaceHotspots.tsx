import { useEffect, useRef, useState } from 'react'

export interface Hotspot {
  id: string
  x: number // percentage (0-100)
  y: number // percentage (0-100)
  scale: number
  rotX: number
  rotY: number
  rotZ: number
}

interface FaceHotspotsProps {
  imageSelector: string
  hotspots: Hotspot[]
  onHotspotEnter?: (hotspot: Hotspot) => void
  onHotspotLeave?: () => void
  showHotspots?: boolean
}

export default function FaceHotspots({ 
  imageSelector, 
  hotspots, 
  onHotspotEnter, 
  onHotspotLeave,
  showHotspots = false 
}: FaceHotspotsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [imageElement, setImageElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const targetImage = document.querySelector(imageSelector) as HTMLElement
    setImageElement(targetImage)

    if (!targetImage || !containerRef.current) return

    // Position hotspots relative to the image
    const updateHotspots = () => {
      const rect = targetImage.getBoundingClientRect()
      const container = containerRef.current
      if (!container) return

      const hotspotsElements = container.querySelectorAll('.face-hotspot')
      hotspotsElements.forEach((hotspotEl, index) => {
        const hotspot = hotspots[index]
        if (!hotspot) return

        const element = hotspotEl as HTMLElement
        element.style.left = `${rect.left + (rect.width * hotspot.x / 100)}px`
        element.style.top = `${rect.top + (rect.height * hotspot.y / 100)}px`
      })
    }

    updateHotspots()
    window.addEventListener('resize', updateHotspots)
    window.addEventListener('scroll', updateHotspots)

    // Intersection Observer for triggering animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Trigger headset landing animation
          hotspots.forEach((hotspot) => {
            if (onHotspotEnter) {
              setTimeout(() => onHotspotEnter(hotspot), 500)
            }
          })
        } else {
          if (onHotspotLeave) {
            onHotspotLeave()
          }
        }
      })
    }, { threshold: 0.5 })

    observer.observe(targetImage)

    return () => {
      window.removeEventListener('resize', updateHotspots)
      window.removeEventListener('scroll', updateHotspots)
      observer.disconnect()
    }
  }, [imageSelector, hotspots, onHotspotEnter, onHotspotLeave])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-10">
      {hotspots.map((hotspot) => (
        <div
          key={hotspot.id}
          className={`face-hotspot ${showHotspots ? 'active' : ''}`}
          data-hotspot-id={hotspot.id}
        />
      ))}
    </div>
  )
}

// Example hotspot configurations
export const portfolioHotspots: Record<string, Hotspot[]> = {
  'neurovr-project': [
    { id: 'face1', x: 25, y: 30, scale: 0.8, rotX: -10, rotY: 15, rotZ: 0 },
    { id: 'face2', x: 75, y: 35, scale: 0.9, rotX: -5, rotY: -10, rotZ: 5 }
  ],
  'cityar-project': [
    { id: 'face1', x: 50, y: 25, scale: 1.0, rotX: 0, rotY: 0, rotZ: 0 }
  ],
  'quantum-project': [
    { id: 'face1', x: 40, y: 40, scale: 1.1, rotX: -15, rotY: 20, rotZ: -5 }
  ]
}