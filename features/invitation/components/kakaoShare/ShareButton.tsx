"use client"

import { ReactNode, forwardRef } from "react"
import Image from "next/image"

type ShareButtonProps = {
  id: string;
  label?: string;
  icon?: ReactNode;
  iconSrc?: string;
  iconAlt?: string;
  backgroundColor?: string;
  hoverColor?: string;
  iconColor?: string;
  onClick?: () => void;
  className?: string;
}

export const ShareButton = forwardRef<HTMLDivElement, ShareButtonProps>(({
  id,
  label,
  icon,
  iconSrc,
  iconAlt,
  backgroundColor = "bg-yellow-400",
  hoverColor = "hover:bg-yellow-500",
  iconColor,
  onClick,
  className = ""
}, ref) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverColor && hoverColor.startsWith('#')) {
      e.currentTarget.style.backgroundColor = hoverColor;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (backgroundColor && backgroundColor.startsWith('#')) {
      e.currentTarget.style.backgroundColor = backgroundColor;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div 
        id={id}
        ref={ref}
        className={`w-12 h-12 ${backgroundColor.startsWith('#') ? '' : backgroundColor} rounded-full flex items-center justify-center cursor-pointer ${hoverColor.startsWith('#') ? '' : hoverColor} transition-colors ${className}`}
        style={backgroundColor.startsWith('#') ? { backgroundColor } : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {iconSrc ? (
          <Image
            src={iconSrc}
            alt={iconAlt || label || ''}
            width={48}
            height={48}
            className="w-12 h-12 object-cover rounded-full"
          />
        ) : (
          iconColor ? (
            <div style={{ color: iconColor }}>
              {icon}
            </div>
          ) : (
            icon
          )
        )}
      </div>
      {label && <span className="text-xs text-gray-600 font-hana">{label}</span>}
    </div>
  )
})
