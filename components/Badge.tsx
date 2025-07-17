import type React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const getVariantClass = () => {
    switch (variant) {
      case "secondary":
        return "badge-moderate";
      case "destructive":
        return "badge-high";
      default:
        return "badge-low";
    }
  };

  return (
    <span className={`badge ${getVariantClass()} ${className}`}>
      {children}
    </span>
  );
}
