import { Button } from "@/components/ui/button";
import { colors } from "@/constants/colors";

interface SubmitButtonProps {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SubmitButton({
  type = "submit",
  disabled = false,
  onClick,
  children,
  className = "",
}: SubmitButtonProps) {
  return (
    <Button
      type={type}
      className={`w-full py-4 text-lg ${className}`}
      style={{ backgroundColor: colors.primary.main, fontFamily: "Hana2-CM" }}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
} 