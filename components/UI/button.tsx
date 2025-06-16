import type React from "react";
import { clsx } from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "relative text-secondary rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        "bg-accent shadow-lg hover:shadow-xl hover:opacity-80",
        "px-8 py-4 text-lg",
        "font-['BreatheFireIII']",
        className
      )}
    >
      <span className="relative z-10 tracking-wide">{children}</span>
      {/* Subtle inner shadow for depth */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
    </button>
  );
};
