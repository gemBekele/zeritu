"use client";

import { AlertCircle, X } from "lucide-react";
import { Button } from "./button";

interface ErrorMessageProps {
  error: string | Error | null;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorMessage({ error, onDismiss, className }: ErrorMessageProps) {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div
      className={`bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-3 ${className || ''}`}
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">{errorMessage}</div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive hover:text-destructive"
          onClick={onDismiss}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}








