import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  icon?: ReactNode;
}

export function Card({ title, icon, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-black/5 bg-white p-5 shadow-sm",
        "transition-shadow hover:shadow-md",
        className,
      )}
      {...props}
    >
      {(title || icon) && (
        <div className="mb-3 flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          {title && (
            <h3 className="text-lg font-bold text-ink">{title}</h3>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
