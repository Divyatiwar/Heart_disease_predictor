"use client";

import type React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "outline" | "danger";
  type?: "button" | "submit";
}

export function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
  type = "button",
}: ButtonProps) {
  const getClassName = () => {
    const baseClass = "button";
    switch (variant) {
      case "outline":
        return `${baseClass} button-outline`;
      case "danger":
        return `${baseClass} button-danger`;
      default:
        return `${baseClass} button-primary`;
    }
  };

  return (
    <button
      type={type}
      className={getClassName()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
