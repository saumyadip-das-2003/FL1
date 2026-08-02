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
    <span className={cn("group inline-flex max-w-full items-start gap-3 leading-none", className)}>
      {logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="" className="h-10 w-10 shrink-0 object-contain transition group-hover:scale-105" />
      )}
      <span className="inline-flex min-w-0 flex-col">
      <span className="max-w-[72vw] truncate font-serif text-xl tracking-normal md:max-w-none md:text-2xl">{companyName}</span>
      <span
        className={cn(
          "mt-1 max-w-[72vw] truncate text-[9px] uppercase tracking-[0.2em] text-muted transition group-hover:text-ink dark:group-hover:text-paper md:max-w-none md:text-[10px] md:tracking-[0.28em]",
          light && "text-white/58 group-hover:text-white"
        )}
      >
        {tagline}
      </span>
      </span>
    </span>
  );
}
