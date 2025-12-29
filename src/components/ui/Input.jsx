"use client";

import { cn } from "@/lib/utils";

export function Input({
  label,
  error,
  helperText,
  className,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-2 rounded-lg",
          "bg-[--muted] border border-[--border]",
          "text-foreground placeholder:text-zinc-500",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:shadow-lg focus:shadow-primary/20",
          "transition-all duration-300",
          error && "border-red-500 focus:ring-red-500 focus:shadow-red-500/20",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-zinc-400">{helperText}</p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  error,
  helperText,
  className,
  rows = 4,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          "w-full px-4 py-2 rounded-lg",
          "bg-[--muted] border border-[--border]",
          "text-foreground placeholder:text-zinc-500",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:shadow-lg focus:shadow-primary/20",
          "transition-all duration-300 resize-none",
          error && "border-red-500 focus:ring-red-500 focus:shadow-red-500/20",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-zinc-400">{helperText}</p>
      )}
    </div>
  );
}

