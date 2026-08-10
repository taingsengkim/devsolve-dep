"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import "@uiw/react-markdown-preview/markdown.css";

/**
 * Read-only markdown, for the overview and the step bodies authors write in
 * `MarkdownEditor`. Same renderer as that editor's preview pane, so what was
 * written is what shows.
 *
 * Loaded on the client only: the underlying preview reaches for `window`.
 */
const MarkdownPreview = dynamic(
  async () => (await import("@uiw/react-md-editor")).default.Markdown,
  {
    ssr: false,
    loading: () => (
      <div className="h-24 w-full animate-pulse rounded-xl bg-muted" />
    ),
  },
);

interface MarkdownViewProps {
  source: string;
  className?: string;
}

export function MarkdownView({ source, className }: MarkdownViewProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div
      data-color-mode={
        resolvedTheme === "dark"
          ? "dark"
          : resolvedTheme === "light"
            ? "light"
            : "auto"
      }
      className={className}
    >
      <MarkdownPreview
        source={source}
        /* The renderer paints its own surface; the page's card is the surface
           here, so it is made transparent and only the type is inherited. */
        style={{ background: "transparent" }}
        className="!bg-transparent [&.wmde-markdown]:!text-[17px] [&.wmde-markdown]:!leading-relaxed"
      />
    </div>
  );
}
