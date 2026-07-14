"use client";

import Image from "next/image";
import { FadeInView } from "@/components/shared/FadeInView";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AboutPage() {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setFormState(res.ok ? "sent" : "error");
    } catch {
      setFormState("error");
    }
  }

  return (
    <div className="pb-24">

      {/* ── Welcome — Croeso ── two-column: text left, illustration right */}
      <FadeInView className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center" style={{ paddingTop: "15%", paddingBottom: "15%" }}>

          {/* Left: heading + body */}
          <div>
            <h1 className="font-serif text-5xl sm:text-12xl font-semibold text-foreground mb-8 leading-tight">
              Croeso
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-4" style={{ fontSize: "1.25em" }}>
              To the world of Dancing Salamanders, where music becomes a bridge to hope, connection, and understanding.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4" style={{ fontSize: "1.25em" }}>
              As an artist, we strive to weave intricate stories that touch the heart and inspire
              the soul. Our songs are crafted with a deep sense of purpose, blending acoustic
              melodies with philosophical reflections and strong narratives that speak to the
              human experience.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4" style={{ fontSize: "1.25em" }}>
              Our musical style is a fusion of acoustic guitar, violin, mandolin, cello, and flute,
              creating a rich tapestry of sound that is both intimate and expansive.
            </p>
            <p className="text-muted-foreground leading-relaxed" style={{ fontSize: "1.25em" }}>
              We draw inspiration from indie and folk traditions, infusing each song with a
              quality that resonates with listeners of all ages, inviting you to join us on a journey
              through the landscapes of the heart and mind.
            </p>
          </div>

          {/* Right: illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-[3/4]" >
              <Image
                src="/images/hero/about_top_image.png"
                alt="Dancing Salamanders illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

        </div>
      </FadeInView>


      {/* ── Our Message ── wide box, small margins, image via <Image> to avoid zoom */}
      <div className="px-4 sm:px-8 py-10" style={{ paddingTop: "5%", paddingBottom: "5%" }}>
        <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "480px" }}>
          {/* Background image */}
          <Image
            src="/images/hero/about_middle_bg.png"
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: "center 60%" }}
            sizes="90vw"
          />
          {/* Content layer */}
          <FadeInView className="relative z-10 w-full px-[6%] sm:px-[13%] py-14 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 min-h-[480px]">

            {/* Left: heading */}
            <div className="flex-shrink-0 lg:w-64">
              <h2 className="font-serif text-5xl sm:text-12xl font-bold text-white leading-tight drop-shadow-lg">
                Our message
              </h2>
            </div>

            {/* Right: teal card + button */}
            <div className="flex-1 flex flex-col gap-5 max-w-md ml-auto">
              <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: "rgba(32, 178, 150, 0.82)", width: "150%" }}>
                <p className="text-white leading-relaxed mb-3 text-sm sm:text-base" style={{ fontSize: "1.25em" }}>
                  We believe in the power of music to reach out to others, offering solace and a sense
                  of belonging.
                </p>
                <p className="text-white leading-relaxed mb-3 text-sm sm:text-base" style={{ fontSize: "1.25em" }}>
                  Our lyrics explore the complexities of life, family, philosophy, spirituality,
                  and the myriad emotions that define our journey.
                </p>
                <p className="text-white leading-relaxed mb-3 text-sm sm:text-base" style={{ fontSize: "1.25em" }}>
                  Through our music, we aim to shed light on the strategies of coping, the importance of
                  resilience, and the unwavering belief in a brighter tomorrow.
                </p>
                <p className="text-white leading-relaxed text-sm sm:text-base" style={{ fontSize: "1.25em" }}>
                  We know from experience how overwhelming grief can feel, and how important it is to meet
                  people who truly understand. Our friends organisation offers a safe place to share, heal
                  and find a way forward at your own pace, without expectations.
                </p>
              </div>
              <div className="flex justify-end">
                <a
                  href="https://www.livslusths.se/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "rgba(32, 178, 150, 0.75)" }}
                >
                  💛 Find support
                </a>
              </div>
            </div>

          </FadeInView>
        </div>
      </div>


      {/* ── BIO ── two-column: text left, portrait right */}
      <FadeInView className="mx-auto max-w-7xl px-2 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center" style={{ paddingTop: "10%", paddingBottom: "15%" }}>


          {/* Left: bio text + social links */}
          <div>
            <h2 className="font-serif text-5xl sm:text-12xl  font-semibold text-foreground mb-8">
              BIO
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4" style={{ fontSize: "1.25em" }}>
              Born amidst the serene landscapes of northern Sweden, I grew up with a deep appreciation
              for nature&apos;s rhythms and the stories they tell.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4" style={{ fontSize: "1.25em" }}>
              My journey has since taken me across the world, with transplanted roots now in Wales,
              Cornwall and Seoul, where diverse cultures have further fuelled my passion for creating
              music that resonates with the soul.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8" style={{ fontSize: "1.25em" }}>
              Through Dancing Salamanders, I aim to weave together these rich influences, crafting
              melodies that connect, inspire, and illuminate hope. Music, for me, is not just an art
              form — it is a way of reaching out to those who need it most.
            </p>
          </div>

          {/* Right: portrait */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 sm:w-140 sm:h-130 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl">
              <Image
                src="/images/hero/about_bottom_image.png"
                alt="Eric and Tima"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </FadeInView>


      {/* ── Contact ── */}
      <FadeInView className="mx-auto max-w-xl px-4 sm:px-6 py-16">
        <h2 className="font-serif text-5xl sm:text-12xl font-semibold text-foreground mb-2">Contact us.</h2>
        <p className="text-sm text-muted-foreground mb-8" style={{ fontSize: "1.25em" }}>
          Want to send us a message? Feel free to use this form and we will contact you.
        </p>

        {formState === "sent" ? (
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <p className="font-serif text-xl text-foreground mb-2">Thank you 💛</p>
            <p className="text-sm text-muted-foreground">Your message has been sent. We&apos;ll be in touch.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm text-muted-foreground mb-1.5">Name</label>
                <Input id="name" name="name" required maxLength={100} placeholder="Your name" className="bg-card border-border" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-muted-foreground mb-1.5">Email</label>
                <Input id="email" name="email" type="email" required placeholder="your@email.com" className="bg-card border-border" />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm text-muted-foreground mb-1.5">Message</label>
              <Textarea id="message" name="message" required minLength={10} maxLength={2000} rows={5} placeholder="Your message..." className="bg-card border-border resize-none" />
            </div>
            {formState === "error" && (
              <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
            )}
            <Button type="submit" disabled={formState === "sending"} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
              {formState === "sending" ? "Sending…" : "Send"}
            </Button>
          </form>
        )}
      </FadeInView>

    </div>
  );
}
