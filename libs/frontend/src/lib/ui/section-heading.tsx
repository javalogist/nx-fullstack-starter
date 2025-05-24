
import { cn } from './utils';

interface SectionHeadingProps {
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeading({
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-2 mb-8",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className
      )}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-muted-foreground max-w-[700px] text-balance",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>

      )}
    </div>
  );
}
