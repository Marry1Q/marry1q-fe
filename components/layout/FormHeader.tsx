import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface FormHeaderProps {
  title: string;
  onBack?: () => void;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "7xl";
  useDefaultBack?: boolean;
}

export function FormHeader({ 
  title, 
  onBack, 
  maxWidth = "4xl",
  useDefaultBack = false 
}: FormHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (useDefaultBack) {
      window.history.back();
    }
  };

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className={`max-w-${maxWidth} mx-auto px-4 py-4`}>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="absolute left-4"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl" style={{ fontFamily: "Hana2-CM" }}>
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}
