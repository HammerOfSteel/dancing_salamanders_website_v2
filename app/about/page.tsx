"use client";

import { PageHero } from "@/components/shared/PageHero";
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
      <PageHero title="Welcome — Croeso" size="sm" />

      {/* Intro */}
      <FadeInView className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
        <p className="font-serif text-xl text-muted-foreground leading-relaxed mb-4">
          To the world of Dancing Salamanders, where music becomes a bridge to hope,
          connection, and understanding.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          As an artist, we strive to weave intricate stories that touch the heart and inspire the soul.
          Our songs are crafted with a deep sense of purpose, blending acoustic melodies with
          philosophical reflections and strong narratives that speak to the human experience.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Our musical style is a fusion of acoustic guitar, violin, mandolin, cello, and flute,
          creating a rich tapestry of sound that is both intimate and expansive. We draw inspiration
          from indie and folk traditions, infusing each song with a timeless quality that resonates
          with listeners of all ages.
        </p>
      </FadeInView>

      <Separator className="bg-border max-w-6xl mx-auto" />

      {/* Our Message */}
      <FadeInView className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
        <h2 className="font-serif text-3xl font-semibold text-foreground mb-6">Our Message</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We believe in the power of music to reach out to others, offering solace and a sense
          of belonging. Our lyrics explore the complexities of life, family, philosophy, spirituality,
          and the myriad emotions that define our journey.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Through our music, we aim to shed light on the strategies of coping, the importance of
          resilience, and the unwavering belief in a brighter tomorrow. We know from experience how
          overwhelming grief can feel, and how important it is to meet people who truly understand.
        </p>
        <a
          href="https://www.livslusths.se/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          💛 Find support at Livslusth →
        </a>
      </FadeInView>

      <Separator className="bg-border max-w-6xl mx-auto" />

      {/* Bio */}
      <FadeInView className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
        <h2 className="font-serif text-3xl font-semibold text-foreground mb-6">Bio</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Born amidst the serene landscapes of northern Sweden, I grew up with a deep appreciation
          for nature's rhythms and the stories they tell. My journey has since taken me across the
          world, with transplanted roots now in Wales, Cornwall and Seoul, where diverse cultures
          have further fuelled my passion for creating music that resonates with the soul.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Through Dancing Salamanders, I aim to weave together these rich influences, crafting
          melodies that connect, inspire, and illuminate hope.
        </p>

        {/* Social links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <a href="https://soundcloud.com/dancingsalamanders" target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline underline-offset-2">
            SoundCloud ↗
          </a>
          <a href="https://open.spotify.com/artist/1KGvM7M0K9mwqiKJiGBBst" target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline underline-offset-2">
            Spotify ↗
          </a>
          <a href="https://saddadsclub.org/" target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline underline-offset-2">
            Sad Dads Club ↗
          </a>
        </div>
      </FadeInView>

      <Separator className="bg-border max-w-6xl mx-auto" />

      {/* Contact */}
      <FadeInView className="mx-auto max-w-xl px-4 sm:px-6 py-14">
        <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">Contact</h2>
        <p className="text-sm text-muted-foreground mb-8">
          Want to send a message? Feel free to use this form and we will get back to you.
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
              {formState === "sending" ? "Sending…" : "Send Message"}
            </Button>
          </form>
        )}
      </FadeInView>
    </div>
  );
}
