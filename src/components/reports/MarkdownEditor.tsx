"use client";

import React from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 animate-pulse flex items-center justify-center text-slate-400 text-base font-medium">
      Loading Markdown Editor...
    </div>
  ),
});

interface MarkdownEditorProps {
  value: string;
  onChange: (value?: string) => void;
  placeholder?: string;
  height?: number;
  error?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Describe the root cause, affected parameters, and overall architecture vulnerability...",
  height = 480,
  error = false,
}: MarkdownEditorProps) {
  return (
    <div
      data-color-mode="auto"
      className={`w-full rounded-xl border transition-colors overflow-hidden ${
        error
          ? "border-red-500 ring-1 ring-red-500"
          : "border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-600"
      }`}
    >
      <MDEditor
        value={value}
        onChange={onChange}
        height={height}
        preview="edit"
        textareaProps={{
          placeholder,
          style: {
            fontSize: "18px",
            lineHeight: "1.7",
          },
        }}
        className="!text-lg [&_textarea]:!text-[18px] [&_textarea]:!leading-relaxed [&_.w-md-editor-text-input]:!text-[18px] [&_.w-md-editor-text-input]:!leading-relaxed [&_.w-md-editor-text-pre]:!text-[18px] [&_.w-md-editor-text-pre]:!leading-relaxed [&_.w-md-editor-text-pre_code]:!text-[18px] [&_.wmde-markdown]:!text-[17px] [&_.wmde-markdown]:!leading-relaxed"
      />
    </div>
  );
}
