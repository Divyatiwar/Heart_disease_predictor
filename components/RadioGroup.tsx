/* components/RadioGroup.tsx */
"use client";

import type React from "react";
import { createContext, useContext } from "react";

type RadioContextType = {
  selected: string;
  change: (v: string) => void;
};

const RadioContext = createContext<RadioContextType | null>(null);

/* ----------  RadioGroup  ---------- */
interface RadioGroupProps {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function RadioGroup({
  value,
  onValueChange,
  children,
  className = "",
}: RadioGroupProps) {
  return (
    <RadioContext.Provider value={{ selected: value, change: onValueChange }}>
      <div className={`radio-group ${className}`} role="radiogroup">
        {children}
      </div>
    </RadioContext.Provider>
  );
}

/* ----------  RadioGroupItem  ---------- */
interface RadioGroupItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  id: string;
}

export function RadioGroupItem({
  value,
  id,
  className = "",
  ...rest
}: RadioGroupItemProps) {
  const ctx = useContext(RadioContext);
  if (!ctx) {
    console.error("RadioGroupItem must be used inside RadioGroup");
    return null;
  }

  const handleChange = () => ctx.change(value);

  return (
    <input
      {...rest}
      type="radio"
      id={id}
      value={value}
      checked={ctx.selected === value}
      onChange={handleChange}
      className={`radio-input ${className}`}
    />
  );
}
