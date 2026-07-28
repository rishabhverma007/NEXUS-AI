import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "default" | "bordered" | "elevated";
  glow?: boolean;
}

export function Card({
  className,
  variant = "glass",
  glow = false,
  ...props
}: CardProps) {
  const variants = {
    glass:
      "glass-card rounded-2xl p-6 text-slate-100 transition-all duration-300",
    default:
      "bg-[#0D1117] rounded-2xl border border-white/5 p-6 text-slate-100 transition-all duration-300 hover:border-white/10",
    bordered:
      "bg-transparent rounded-2xl border border-white/8 p-6 text-slate-100 transition-all duration-300 hover:border-white/15",
    elevated:
      "bg-[#0D1117] rounded-2xl border border-white/5 p-6 text-slate-100 shadow-soft transition-all duration-300 hover:shadow-elevated hover:border-white/10",
  };

  return (
    <div
      className={cn(
        variants[variant],
        glow && "border-glow",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 pb-4 border-b border-white/5",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold tracking-tight text-slate-100",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-sm text-slate-400 leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-4", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center pt-4 border-t border-white/5",
        className
      )}
      {...props}
    />
  );
}
