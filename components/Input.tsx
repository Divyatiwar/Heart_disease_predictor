"use client";

import type React from "react";

interface InputProps {
  id?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step?: string;
}

export function Input({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  step,
}: InputProps) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      step={step}
      className="form-input"
    />
  );
}
