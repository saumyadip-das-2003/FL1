import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  light = false,
  companyName = "Atelier Northline",
  tagline = "Architecture Studio",
  logoUrl = ""
}: {
  className?: string;
  light?: boolean;
  companyName?: string;
  tagline?: string;
  logoUrl?: string;
}) {
  return (
    <span className={cn("group inline-flex items-start gap-3 leading-none", className)}>
      {logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="" className="h-10 w-10 shrink-0 object-contain transition group-hover:scale-105" />
      )}
      <span className="inline-flex flex-col">
      <span className="font-serif text-2xl tracking-normal">{companyName}</span>
      <span
        className={cn(
          "mt-1 text-[10px] uppercase tracking-[0.28em] text-muted transition group-hover:text-ink dark:group-hover:text-paper",
          light && "text-white/58 group-hover:text-white"
        )}
      >
        {tagline}
      </span>
      </span>
    </span>
  );
}
