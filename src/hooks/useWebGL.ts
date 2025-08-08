import { useEffect, useState } from 'react'

export function useWebGLSupported() {
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      setIsSupported(!!context)
    } catch (e) {
      setIsSupported(false)
    }
  }, [])

  return isSupported
}

export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mediaQuery.addEventListener('change', handler)
    
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}

export function usePerformanceClamp() {
  const [shouldClamp, setShouldClamp] = useState(false)

  useEffect(() => {
    // Detect low-power devices
    const isLowPower = 
      navigator.hardwareConcurrency <= 2 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    setShouldClamp(isLowPower)
  }, [])

  return shouldClamp
}