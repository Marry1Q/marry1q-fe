import React from "react";
import { cn } from "@/lib/utils";
import { colors } from "@/constants/colors";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  variant?: "default" | "fullscreen";
}

export function LoadingSpinner({
  size = "md",
  text,
  className,
  variant = "default"
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  const spinner = (
    <div className="text-center">
      <div
        className={cn(
          "animate-spin rounded-full border-b-2 mx-auto mb-4",
          sizeClasses[size]
        )}
        style={{ borderColor: colors.primary.main }}
      />
      {text && (
        <p className="text-gray-600" style={{ fontFamily: "Hana2-CM" }}>
          {text}
        </p>
      )}
    </div>
  );

  if (variant === "fullscreen") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="container mx-auto p-4">
          {spinner}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center h-64", className)}>
      {spinner}
    </div>
  );
}
