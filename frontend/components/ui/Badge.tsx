import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "accent" | "success";
  className?: string;
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium",
        variant === "default" && "bg-card text-muted border border-border",
        variant === "primary" && "bg-primary/10 text-primary border border-primary/20",
        variant === "accent" && "bg-accent/10 text-accent border border-accent/20",
        variant === "success" && "bg-success/10 text-success border border-success/20",
        className
      )}
    >
      {children}
    </span>
  );
}
