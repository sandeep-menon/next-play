"use client"

import { Button } from "@/components/ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Link from "next/link";
import { useRef } from "react";

export default function Home() {
  const container = useRef(null);

  useGSAP(() => {
    const split = SplitText.create(".item-3", { type: "words" });

    const tl = gsap.timeline({ defaults: { delay: 1, duration: 1, ease: "power2.out" } });
    tl.from(".item-1", { scale: 3, autoAlpha: 0 })
      .from(".item-2", { y: -100, autoAlpha: 0 })
      .from(split.words, { y: -100, autoAlpha: 0, rotation: "random(-45, 45)", duration: 0.3, ease: "back", stagger: 0.1 })
      .from(".item-4", { autoAlpha: 0 });
  }, { scope: container });

  return (
    <div ref={container} className="flex flex-col items-center gap-4">
      <div className="item-1 text-7xl md:text-8xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent pb-4">Next Play</div>
      <div className="item-2 text-2xl md:text-3xl font-semibold">Wondering what to play next?</div>
      <div className="item-3 md:text-lg md:max-w-6/12 text-center">Discover your next favorite game. Search across thousands of titles, save the ones you love, and get personalized recommendations. NextPlay makes game discovery simple, fun and tailored for you.</div>
      <div className="item-4 flex gap-4">
        <Button variant="secondary" asChild><Link href="/explore">Explore</Link></Button>
        <Button variant="outline" asChild><Link href="/login">Login</Link></Button>
      </div>
    </div>
  );
}