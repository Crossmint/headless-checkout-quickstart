import type React from "react";
import { clsx } from "clsx";

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className,
  size = "md",
  variant = "primary",
  type = "button",
}) => {
  const baseClasses =
    "relative font-bold text-black rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const variantClasses = {
    primary: "bg-button-bg shadow-lg hover:shadow-xl hover:opacity-80",
    secondary: "bg-gray-600 hover:opacity-80 shadow-md hover:shadow-lg",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      <span className="relative z-10 tracking-wide">{children}</span>

      {/* Subtle inner shadow for depth */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
    </button>
  );
};
