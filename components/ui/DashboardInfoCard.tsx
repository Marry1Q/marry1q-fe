import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { colors } from "@/constants/colors";

interface BackgroundImage {
  src: string;
  alt: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size?: string;
  customClass?: string;
  customStyle?: React.CSSProperties;
}

interface SliderIndicator {
  totalItems: number;
  activeIndex: number;
}

interface DashboardInfoCardProps {
  title: string;
  subtitle?: string;
  description: string;
  actionText?: string;
  backgroundImage?: BackgroundImage;
  sliderIndicator?: SliderIndicator;
  onSliderChange?: (direction: 'prev' | 'next') => void;
  variant?: "default" | "colored";
  color?:
    | "mint"
    | "blue"
    | "red"
    | "yellow"
    | "purple"
    | "brown"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  onClick?: () => void;
  className?: string;
  disableHover?: boolean;
  active?: boolean;
}

export function DashboardInfoCard({
  title,
  subtitle,
  description,
  actionText = "확인하기",
  backgroundImage,
  sliderIndicator,
  onSliderChange,
  variant = "default",
  color,
  onClick,
  className = "w-60 h-60",
  disableHover = false,
  active = false,
}: DashboardInfoCardProps) {
  const getBackgroundImagePosition = () => {
    if (!backgroundImage) return "";

    const position = backgroundImage.position || "bottom-right";
    const size = backgroundImage.size || "w-32 h-32";
    const customClass = backgroundImage.customClass || "";

    let baseClass = "";
    switch (position) {
      case "bottom-right":
        baseClass = `absolute bottom-0 -right-8 ${size}`;
        break;
      case "bottom-left":
        baseClass = `absolute bottom-0 -left-8 ${size}`;
        break;
      case "top-right":
        baseClass = `absolute top-0 -right-8 ${size}`;
        break;
      case "top-left":
        baseClass = `absolute top-0 -left-8 ${size}`;
        break;
      default:
        baseClass = `absolute bottom-0 -right-8 ${size}`;
    }

    return `${baseClass} ${customClass}`.trim();
  };

  const getColorStyle = () => {
    if (variant === "default") {
      // default variant에서는 회색 테두리만 유지 (색상별 테두리 제거)
      return {};
    }

    if (color === "primary") {
      return { backgroundColor: colors.primary.main };
    } else if (color === "secondary") {
      return { backgroundColor: colors.secondary.main };
    } else if (color === "success") {
      return { backgroundColor: colors.success.main };
    } else if (color === "warning") {
      return { backgroundColor: colors.warning.main };
    } else if (color === "danger") {
      return { backgroundColor: colors.danger.main };
    } else if (color && color in colors.hana) {
      return {
        backgroundColor: colors.hana[color as keyof typeof colors.hana].main,
      };
    }

    return {};
  };

  const getHoverColorStyle = () => {
    if (color === "primary") {
      return { backgroundColor: colors.primary.main };
    } else if (color === "secondary") {
      return { backgroundColor: colors.secondary.main };
    } else if (color === "success") {
      return { backgroundColor: colors.success.main };
    } else if (color === "warning") {
      return { backgroundColor: colors.warning.main };
    } else if (color === "danger") {
      return { backgroundColor: colors.danger.main };
    } else if (color && color in colors.hana) {
      return {
        backgroundColor: colors.hana[color as keyof typeof colors.hana].main,
      };
    }

    return {};
  };

  const [isHovered, setIsHovered] = useState(false);
  const isHoverLike = (!disableHover && active) || (!disableHover && isHovered);

  const getTextColorClasses = () => {
    if (variant === "colored") {
      return {
        title: "text-blue-100",
        subtitle: "text-white",
        description: "text-blue-50",
        action: "text-blue-100",
      };
    }
    
    // 호버 상태(혹은 active)이고 색상이 있는 경우 흰색 텍스트 사용
    if (isHoverLike && color) {
      return {
        title: "text-white transition-colors duration-300",
        subtitle: "text-white transition-colors duration-300",
        description: "text-white transition-colors duration-300",
        action: "text-white transition-colors duration-300",
      };
    }
    
    return {
      title: "text-gray-600 transition-colors duration-300",
      subtitle: "text-black transition-colors duration-300",
      description: "text-gray-700 transition-colors duration-300",
      action: "text-gray-600 transition-colors duration-300",
    };
  };

  const textColors = getTextColorClasses();

  return (
    <div
      className={cn("flex-shrink-0 snap-start cursor-pointer group", className)}
      onClick={onClick}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl shadow-lg border border-gray-200 transition-all duration-300 h-full",
          !disableHover && "hover:shadow-xl",
          variant === "default" && "bg-white",
          variant === "colored" && "text-white"
        )}
        style={isHoverLike ? getHoverColorStyle() : getColorStyle()}
        onMouseEnter={() => !disableHover && setIsHovered(true)}
        onMouseLeave={() => !disableHover && setIsHovered(false)}
      >
        {/* 배경 이미지 */}
        {backgroundImage && (
          <div 
            className={getBackgroundImagePosition()}
            style={backgroundImage.customStyle}
          >
            <img
              src={backgroundImage.src}
              alt={backgroundImage.alt}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* 텍스트 영역 */}
        <div className="relative p-6 h-full flex flex-col">
          <div className="flex-1 flex flex-col">
            <div className="mb-2">
              <p className={`text-sm ${textColors.title} mb-1`}>{title}</p>
              {subtitle && (
                <h3
                  className={`text-xl ${textColors.subtitle} mb-2`}
                  style={{ fontFamily: "Hana2-CM" }}
                >
                  {subtitle}
                </h3>
              )}
              <p
                className={`text-sm ${textColors.description} leading-relaxed`}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
            {actionText && (
              <div
                className={`flex items-center text-sm ${textColors.action} mt-auto`}
              >
                <span>{actionText}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            )}
          </div>

          {/* 슬라이드 인디케이터 */}
          {sliderIndicator && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {Array.from(
                    { length: sliderIndicator.totalItems },
                    (_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          index === sliderIndicator.activeIndex
                            ? "bg-gray-800"
                            : "bg-gray-300"
                        }`}
                      />
                    )
                  )}
                </div>
                {sliderIndicator.totalItems > 1 && onSliderChange && (
                  <div className="flex gap-1 slider-controls">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSliderChange('prev');
                      }}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSliderChange('next');
                      }}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
