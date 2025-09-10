"use client";

import React, { useState, useRef, useEffect } from "react";
import { Palette, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { colors } from "@/constants/colors";

interface ColorSelectorProps {
  selectedColor?: string;
  onColorSelect: (colorName: string) => void;
  className?: string;
}

export function ColorSelector({
  selectedColor,
  onColorSelect,
  className
}: ColorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 색상 팔레트 (하나은행 색상)
  const colorPalette = Object.keys(colors.hana).map(colorName => ({
    name: colorName as keyof typeof colors.hana,
    value: colors.hana[colorName as keyof typeof colors.hana].main,
    label: colorName.charAt(0).toUpperCase() + colorName.slice(1)
  }));

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

  const handleColorSelect = (colorName: string) => {
    onColorSelect(colorName);
    setIsOpen(false);
  };

  const getSelectedColorValue = () => {
    if (selectedColor && colors.hana[selectedColor as keyof typeof colors.hana]) {
      return colors.hana[selectedColor as keyof typeof colors.hana].main;
    }
    return colors.hana.mint.main; // 기본 색상으로 mint 사용
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* 선택된 색상 표시 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-6 h-6 rounded-full border border-gray-300"
              style={{ backgroundColor: getSelectedColorValue() }}
            />
            <span className="text-sm text-gray-700">
              {selectedColor ? colorPalette.find(c => c.name === selectedColor)?.label : "Mint (기본)"}
            </span>
          </div>
          <div className="text-gray-400">
            {isOpen ? <X size={16} /> : <Palette size={16} />}
          </div>
        </div>
      </button>

      {/* 드롭다운 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="p-3">
            <div className="grid grid-cols-4 gap-2">
              {colorPalette.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorSelect(color.name)}
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
          </div>
        </div>
      )}
    </div>
  );
}
