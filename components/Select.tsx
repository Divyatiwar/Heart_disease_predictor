"use client";

import React, { useState, useEffect, useRef } from "react";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  children: React.ReactNode;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder: string;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);

  // Extract SelectValue and SelectItem components from children
  const selectValue = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === SelectValue
  ) as React.ReactElement<SelectValueProps> | undefined;

  const selectItems = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === SelectItem
  ) as React.ReactElement<SelectItemProps>[];

  // Update selected label when value changes
  useEffect(() => {
    const selectedItem = selectItems.find((item) => item.props.value === value);
    if (selectedItem) {
      setSelectedLabel(selectedItem.props.children as string);
    } else {
      setSelectedLabel("");
    }
  }, [value, selectItems]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (itemValue: string, itemLabel: string) => {
    onValueChange(itemValue);
    setSelectedLabel(itemLabel);
    setIsOpen(false);
  };

  return (
    <div className="select-container" ref={selectRef}>
      <button
        type="button"
        className="select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={selectedLabel ? "select-value" : "select-placeholder"}>
          {selectedLabel ||
            selectValue?.props.placeholder ||
            "Select an option"}
        </span>
        <svg
          className={`select-arrow ${isOpen ? "select-arrow-open" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="select-content">
          {selectItems.map((item) => (
            <button
              key={item.props.value}
              type="button"
              className={`select-item ${
                value === item.props.value ? "select-item-selected" : ""
              }`}
              onClick={() =>
                handleSelect(item.props.value, item.props.children as string)
              }
            >
              {item.props.children}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SelectTrigger({ children }: SelectTriggerProps) {
  return <>{children}</>;
}

export function SelectContent({ children }: SelectContentProps) {
  return <>{children}</>;
}

export function SelectItem({ value, children }: SelectItemProps) {
  return <option value={value}>{children}</option>;
}

export function SelectValue({ placeholder }: SelectValueProps) {
  return <span>{placeholder}</span>;
}
