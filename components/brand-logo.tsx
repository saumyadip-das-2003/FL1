import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  light = false
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <span className={cn("group inline-flex flex-col leading-none", className)}>
      <span className="font-serif text-2xl tracking-normal">Atelier Northline</span>
      <span
        className={cn(
          "mt-1 text-[10px] uppercase tracking-[0.28em] text-muted transition group-hover:text-ink dark:group-hover:text-paper",
          light && "text-white/58 group-hover:text-white"
        )}
      >
        Architecture Studio
      </span>
    </span>
  );
}
