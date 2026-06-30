import { cn } from "@/lib/utils";

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  title,
  description,
  header,
  className,
  onClick,
  style,
}: {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        "flex flex-col justify-between rounded-2xl p-4 md:p-6 min-h-[220px]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {header}
      <div>
        <div className="mb-1 mt-4 font-display text-xl md:text-2xl font-bold">{title}</div>
        <div className="text-sm md:text-base text-white/50 leading-relaxed">{description}</div>
      </div>
    </div>
  );
}
