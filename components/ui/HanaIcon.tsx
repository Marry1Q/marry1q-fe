"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { iconMapping, IconName, iconMetadata } from "@/lib/iconMapping";

interface HanaIconProps {
  name: IconName;
  size?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
  quality?: number;
}

export function HanaIcon({
  name,
  size = 24,
  className,
  alt,
  priority = false,
  quality = 100,
}: HanaIconProps) {
  const iconPath = iconMapping[name];
  const metadata = iconMetadata[name as keyof typeof iconMetadata];

  // alt 텍스트가 제공되지 않은 경우 메타데이터에서 가져오기
  const altText = alt || metadata?.name || name;

  if (!iconPath) {
    console.warn(`Icon "${name}" not found in iconMapping`);
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-200 rounded",
          className
        )}
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-gray-500">?</span>
      </div>
    );
  }

  return (
    <div
      className={cn("relative flex-shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={iconPath}
        alt={altText}
        width={size}
        height={size}
        className="object-contain"
        priority={priority}
        quality={quality}
        onError={(e) => {
          console.error(`Failed to load icon: ${iconPath}`);
          // 에러 시 fallback 처리
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
        }}
      />
    </div>
  );
}

// 아이콘 선택을 위한 헬퍼 컴포넌트
interface IconSelectorProps {
  selectedIcon: IconName;
  onIconSelect: (icon: IconName) => void;
  category?: keyof typeof import("@/lib/iconMapping").iconCategories;
  className?: string;
}

export function IconSelector({
  selectedIcon,
  onIconSelect,
  category,
  className,
}: IconSelectorProps) {
  const { iconCategories, iconMapping } = require("@/lib/iconMapping");

  const iconsToShow = category
    ? iconCategories[category]
    : (Object.keys(iconMapping) as IconName[]);

  return (
    <div className={cn("grid grid-cols-6 gap-2 p-4", className)}>
      {iconsToShow.map((iconName: IconName) => (
        <button
          key={iconName}
          onClick={() => onIconSelect(iconName)}
          className={cn(
            "p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105",
            selectedIcon === iconName
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <HanaIcon name={iconName} size={32} />
        </button>
      ))}
    </div>
  );
}

// 아이콘 프리로더 (성능 최적화)
export function IconPreloader({ icons }: { icons: IconName[] }) {
  return (
    <div className="hidden">
      {icons.map((iconName) => (
        <Image
          key={iconName}
          src={iconMapping[iconName]}
          alt=""
          width={1}
          height={1}
          priority
        />
      ))}
    </div>
  );
}
