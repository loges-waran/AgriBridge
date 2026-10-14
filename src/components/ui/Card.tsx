import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Card({ children, className = "", title, subtitle, action }: CardProps) {
  return (
    <div className={`agri-card p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div>
            {title && <h3 className="text-base font-semibold text-stone-900">{title}</h3>}
            {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
