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
              Dancing Salamanders is music and writing. Songs on acoustic instruments (guitar,
              violin, mandolin, cello, flute) and alongside them, essays and longer stories.
            </p>
            <p className="text-muted-foreground leading-relaxed" style={{ fontSize: "1.25em" }}>
              Most of it comes from the same place: home, family, love, loss and the search for
              meaning through it all.
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
                Writing
              </h2>
            </div>

            {/* Right: teal card + button */}
            <div className="flex-1 flex flex-col gap-5 max-w-md ml-auto">
              <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: "rgba(32, 178, 150, 0.82)", width: "150%" }}>
                <p className="text-white leading-relaxed mb-3 text-sm sm:text-base" style={{ fontSize: "1.25em" }}>
                  Writing doesn&apos;t close over. It lets us come back to the same thing as many times
                  as we need to.
                </p>
                <p className="text-white leading-relaxed mb-3 text-sm sm:text-base" style={{ fontSize: "1.25em" }}>
                  For us it does three things. It&apos;s a way to talk, sometimes to others, to ourselves
                  and sometimes to the one who isn&apos;t here anymore. It&apos;s a way to reflect and to
                  recollect; to slowly see a little more of what happened, a way to bear witness: to say
                  this happened, she was here, it mattered, and to set that down honestly instead of
                  letting it go quiet.
                </p>
                <p className="text-white leading-relaxed text-sm sm:text-base" style={{ fontSize: "1.25em" }}>
                  We don&apos;t have answers, and we try not to pretend we do. But we know it helps, and
                  that it matters to not carry it in silence.
                </p>
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
              Origin
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4" style={{ fontSize: "1.25em" }}>
              Dancing Salamanders and all that it contains is shaped by various landscapes, but it
              came about out of loss, the loss of my daughter Tima.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8" style={{ fontSize: "1.25em" }}>
              In all that it has become and now is, it is something I do in her memory and honour.
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
