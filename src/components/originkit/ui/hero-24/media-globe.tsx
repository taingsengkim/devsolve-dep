// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

"use client";

import { useEffect, useState } from "react";
import Globe from "@/components/originkit/ui/hero-24/globe";
import { useIsDark } from "@/components/landing/SectionBackdrop";

/* Brand primary, so the globe matches the CTA and the shifted backdrop. */
const ACCENT = "#2563EB";

/* Hoisted for the same reason as the globe's own defaults: passed inline these
   were a fresh object on every render, which retriggered the globe's rebuild. */
const DOTS = { color: ACCENT, size: 5, density: 8, allDots: false };
const FILL_PARENT = { width: "100%", height: "100%" } as const;

/** Section 2's globe: Figma panel values (dots #00A1DB · 5 · 8, outline and
 *  grid #00A1DB, ocean #101216, stop on hover, lat 23 / lng -23). Scale is
 *  9.7 rather than the panel's 8 so the sphere fills its 323px frame the way
 *  the design shows it. */
export const MediaGlobe = ({ query }: { query: string }) => {
  const [matches, setMatches] = useState(false);
  /* The ocean is the only part of the globe that has to follow the theme, and
     it matches the section surface exactly (white / neutral-950) so the sphere
     never shows a disc edge against the page. The dots, outline and graticule
     are brand blue and read on either. */
  const isDark = useIsDark();

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  if (!matches) return null;

  return (
    <Globe
      scale={9.7}
      stopOnHover
      initialLatitude={23}
      initialLongitude={-23}
      fill="dots"
      dots={DOTS}
      showOutline
      outlineColor={ACCENT}
      showGrid
      graticuleColor={ACCENT}
      oceanColor={isDark ? "#0A0A0A" : "#FFFFFF"}
      style={FILL_PARENT}
    />
  );
};
