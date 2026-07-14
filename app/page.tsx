import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { FadeInView } from "@/components/shared/FadeInView";

export default function HomePage() {
  return (
    <div className="pb-24">
      <PageHero
        title="Dancing Salamanders"
        subtitle="Echoes of Hope, Harmonies of Heart"
        size="full"
        align="center"
        backgroundImage="/images/hero/landing_top_bg.png"
      />

      {/* Mission — image left, text right */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-28 sm:py-36">
        <FadeInView>
          <div className="flex flex-col md:flex-row items-center gap-14 md:gap-20">
            {/* Image */}
            <div className="w-full md:w-1/2 flex-shrink-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5]">
                <Image
                  src="/images/hero/landing_middle_image.png"
                  alt="Illuminating Hope Through Connection"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            {/* Text */}
            <div className="w-full md:w-1/2">
              <h2 className="font-serif font-bold leading-tight mb-8">
                <span className="block text-5xl sm:text-6xl lg:text-7xl" style={{ color: "oklch(0.72 0.12 180)" }}>Illuminating</span>
                <span className="block text-5xl sm:text-6xl lg:text-7xl text-foreground">Hope Through</span>
                <span className="block text-5xl sm:text-6xl lg:text-7xl text-primary">Connection</span>
              </h2>
              <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed mb-10 max-w-md">
                We know from experience how overwhelming grief can feel, and how important it is to
                meet people who truly understand. Our friends organisation offers a safe place to
                share, heal and find a way forward at your own pace, without expectations.
              </p>
              <a
                href="https://www.livslusths.se/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-3.5 font-semibold text-base hover:bg-primary/90 transition-colors"
              >
                💛 Find support
              </a>
            </div>
          </div>
        </FadeInView>
      </section>
    </div>
  );
}
