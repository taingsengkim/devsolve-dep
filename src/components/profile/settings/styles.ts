// Vercel Geist Minimal tokens — shadow-as-border, pill shapes, Inter type scale.
// Centralized here so every settings component pulls from the same source.

export const colors = {
  primary: "#2563EB",
  secondary: "#1E293B",
  accent: "#10B981",
  destructive: "#ff5b4f",
  text: "#171717",
  textMuted: "#4d4d4d",
  border: "rgba(0,0,0,0.08)",
  surfaceMuted: "#fafafa",
};

// Shadow-as-border: replaces traditional 1px borders with a hairline shadow.
export const cardShadow = "shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_12px_rgba(0,0,0,0.06)]";
export const hairlineShadow = "shadow-[0_0_0_1px_rgba(0,0,0,0.08)]";
export const focusRing = "focus:shadow-[0_0_0_1px_#2563EB,0_0_0_4px_rgba(37,99,235,0.15)]";

export const card = `rounded-[18px] bg-white ${cardShadow}`;

export const sectionLabel = "text-xs font-medium uppercase tracking-wide text-[#4d4d4d]";

export const inputBase = `w-full rounded-[6px] ${hairlineShadow} px-3 py-2 text-sm text-[#171717] placeholder:text-neutral-400 outline-none transition ${focusRing}`;

export const buttonPrimary =
  "inline-flex items-center justify-center gap-1.5 rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1d4fd1] active:translate-y-px disabled:opacity-50 disabled:pointer-events-none";

export const buttonOutline =
  "inline-flex items-center justify-center gap-1.5 rounded-full border-[1.5px] border-[#1E293B]/15 px-4 py-2 text-sm font-semibold text-[#2563EB] transition hover:bg-[#2563EB]/5";

export const buttonGhost =
  "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-[#4d4d4d] transition hover:bg-[#ebebeb]/60";

export const badgePill =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold";