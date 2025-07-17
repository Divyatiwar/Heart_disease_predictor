import type React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
}

interface CardContentProps {
  children: React.ReactNode;
}

interface CardTitleProps {
  children: React.ReactNode;
}

interface CardDescriptionProps {
  children: React.ReactNode;
}

export function Card({ children, className = "" }: CardProps) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function CardHeader({ children }: CardHeaderProps) {
  return <div className="card-header">{children}</div>;
}

export function CardContent({ children }: CardContentProps) {
  return <div className="card-content">{children}</div>;
}

export function CardTitle({ children }: CardTitleProps) {
  return <div className="card-title">{children}</div>;
}

export function CardDescription({ children }: CardDescriptionProps) {
  return <div className="card-description">{children}</div>;
}
