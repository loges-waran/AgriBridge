import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4 rounded-lg border-2 border-dashed border-stone-200 bg-stone-50/50">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 text-stone-500 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-stone-900 mb-1">{title}</h3>
      <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">{description}</p>
      {actionText && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
