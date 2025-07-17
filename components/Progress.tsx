interface ProgressProps {
  value: number
  className?: string
}

export function Progress({ value, className = "" }: ProgressProps) {
  return (
    <div className={`progress-bar ${className}`}>
      <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}
