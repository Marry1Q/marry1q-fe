"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinanceCategoryIcon } from "./FinanceCategoryIcon";
import { availableIcons, searchIcons, IconName } from "@/lib/financeCategoryIcons";
import { colors } from "@/constants/colors";

interface IconSelectorProps {
  selectedIcon?: string;
  selectedColor?: string;
  onIconSelect: (iconName: string) => void;
  onColorSelect: (colorName: string) => void;
  className?: string;
}

export function IconSelector({
  selectedIcon,
  selectedColor,
  onIconSelect,
  onColorSelect,
  className
}: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'icon' | 'color'>('icon');
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 색상 팔레트 (하나은행 색상)
  const colorPalette = Object.keys(colors.hana).map(colorName => ({
    name: colorName as keyof typeof colors.hana,
    value: colors.hana[colorName as keyof typeof colors.hana].main,
    label: colorName.charAt(0).toUpperCase() + colorName.slice(1)
  }));

  // 검색된 아이콘 목록
  const filteredIcons = searchQuery 
    ? searchIcons(searchQuery) 
    : availableIcons;

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleIconSelect = (iconName: string) => {
    onIconSelect(iconName);
    setIsOpen(false);
    setSearchQuery("");
  };

  // 드롭다운을 열 때 기본 색상을 mint로 설정
  const handleDropdownToggle = () => {
    if (!isOpen) {
      // 드롭다운을 열 때 항상 기본값을 mint로 설정
      onColorSelect('mint');
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* 선택된 아이콘 표시 - 원형 배경 추가 */}
      <button
        type="button"
        onClick={handleDropdownToggle}
        className="w-full h-12 border border-gray-300 rounded-full bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center justify-center"
      >
        <FinanceCategoryIcon 
          iconName={selectedIcon} 
          colorName={selectedColor}
          variant="display"
          size={20}
        />
      </button>

      {/* 드롭다운 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-96">
          {/* 탭 헤더 */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab('icon')}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                activeTab === 'icon'
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              아이콘
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('color')}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                activeTab === 'color'
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              색상
            </button>
          </div>

          {/* 탭 내용 */}
          <div className="p-3">
            {activeTab === 'icon' ? (
              /* 아이콘 탭 */
              <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                {filteredIcons.map((iconName) => (
                  <button
                    key={iconName}
                    onClick={() => handleIconSelect(iconName)}
                    className={cn(
                      "w-16 h-16 rounded-lg transition-all duration-200 hover:scale-105 hover:bg-gray-50 flex items-center justify-center",
                      selectedIcon === iconName
                        ? "bg-blue-50 border-2 border-blue-500"
                        : "hover:bg-gray-50 border-2 border-transparent"
                    )}
                    title={iconName}
                  >
                    <FinanceCategoryIcon 
                      iconName={iconName} 
                      colorName={selectedColor}
                      variant="select"
                      size={28}
                    />
                  </button>
                ))}
              </div>
            ) : (
              /* 색상 탭 */
              <div className="grid grid-cols-4 gap-2">
                {colorPalette.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      onColorSelect(color.name);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "p-3 rounded-lg transition-all duration-200 hover:scale-105 flex flex-col items-center gap-1",
                      selectedColor === color.name
                        ? "bg-blue-50 ring-2 ring-blue-500"
                        : "hover:bg-gray-50"
                    )}
                    title={color.label}
                  >
                    <div 
                      className="w-8 h-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="text-xs text-gray-600">{color.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
