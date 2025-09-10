"use client"

import React, { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from '@/lib/hooks/useWindowSize'

interface ConfettiProps {
  isActive: boolean
  onComplete?: () => void
  duration?: number
  colors?: string[]
  numberOfPieces?: number
  recycle?: boolean
  gravity?: number
  wind?: number
  className?: string
}

export const ConfettiEffect: React.FC<ConfettiProps> = ({
  isActive,
  onComplete,
  duration = 5000,
  colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'],
  numberOfPieces = 200,
  recycle = false,
  gravity = 0.3,
  wind = 0.05,
  className
}) => {
  const { width, height } = useWindowSize()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isActive) {
      setShouldRender(true)
      
      if (!recycle) {
        const timer = setTimeout(() => {
          setShouldRender(false)
          onComplete?.()
        }, duration)
        
        return () => clearTimeout(timer)
      }
    } else {
      setShouldRender(false)
    }
  }, [isActive, duration, recycle, onComplete])

  if (!shouldRender || !width || !height) {
    return null
  }

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${className || ''}`}>
      <Confetti
        width={width}
        height={height}
        numberOfPieces={numberOfPieces}
        recycle={recycle}
        colors={colors}
        gravity={gravity}
        wind={wind}
      />
    </div>
  )
}

// 간단한 훅으로 컨페티를 쉽게 사용할 수 있도록 도와주는 훅
export const useConfetti = () => {
  const [isActive, setIsActive] = useState(false)

  const trigger = (duration = 5000) => {
    setIsActive(true)
    setTimeout(() => setIsActive(false), duration)
  }

  return { isActive, trigger }
} 