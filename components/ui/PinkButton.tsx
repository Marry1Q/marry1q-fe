import { Button } from "@/components/ui/button";
import { colors } from "@/constants/colors";

interface PinkButtonProps {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  text: string;
  className?: string;
}

export function PinkButton({
  type = "button",
  disabled = false,
  onClick,
  text,
  className = "",
}: PinkButtonProps) {
  return (
    <Button
      type={type}
      className={`w-full py-4 text-lg ${className}`}
      style={{ 
        backgroundColor: colors.hana.red.main, 
        fontFamily: "Hana2-CM",
        color: "white"
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </Button>
  );
} 