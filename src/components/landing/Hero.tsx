"use client";

import JellyfishDrift from "@/components/ui/jellyfish-drift";
import SmoothCursor from "@/components/lightswind/smooth-cursor";

export function Hero() {
  return (
    <>
      <SmoothCursor color="#6366f1" showTrail={true} glowEffect={true} />
      <JellyfishDrift />
    </>
  );
}

export default Hero;
