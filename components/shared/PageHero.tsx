import Image from "next/image";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "full";
  align?: "left" | "center";
}

const sizeMap = {
  sm: "py-16 md:py-20",
  md: "py-24 md:py-32",
  lg: "py-32 md:py-44",
  full: "min-h-[90vh] flex items-center",
};

export function PageHero({
  title,
  subtitle,
  backgroundImage,
  className,
  size = "md",
  align = "center",
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        sizeMap[size],
        className
      )}
    >
      {/* Background image */}
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </>
      )}

      {/* Background gradient when no image */}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-ds-surface via-background to-background" />
      )}

      {/* Decorative grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div
        className={cn(
          "relative z-10 mx-auto max-w-4xl px-4 sm:px-6",
          align === "center" && "text-center"
        )}
      >
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground leading-tight mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        {/* Decorative line */}
        <div
          className={cn(
            "mt-6 h-px w-24 bg-primary/60",
            align === "center" && "mx-auto"
          )}
        />
      </div>
    </section>
  );
}
