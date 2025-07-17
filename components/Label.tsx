import type React from "react"

interface LabelProps {
  htmlFor?: string
  children: React.ReactNode
}

export function Label({ htmlFor, children }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="form-label">
      {children}
    </label>
  )
}
