import type React from "react";
import { clsx } from "clsx";

interface PaymentMethodButtonProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

export const PaymentMethodButton: React.FC<PaymentMethodButtonProps> = ({
  selected,
  onClick,
  icon,
  label,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row items-center gap-3",
        selected
          ? "border-accent bg-card-foreground"
          : "border-accent-foreground bg-accent-foreground hover:border-card-foreground",
        className
      )}
    >
      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col items-center sm:items-start">
        <span className="text-white text-md font-bold">{label}</span>
      </div>
    </button>
  );
};
