"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Code2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-56 w-full animate-pulse items-center justify-center bg-slate-950 text-sm font-medium text-slate-400">
      Loading editor…
    </div>
  ),
});

/** Monaco's language ids — the label is what the author picks from. */
export const CODE_LANGUAGES = [
  { id: "typescript", label: "TypeScript" },
  { id: "javascript", label: "JavaScript" },
  { id: "tsx", label: "TSX / JSX" },
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
  { id: "php", label: "PHP" },
  { id: "sql", label: "SQL" },
  { id: "shell", label: "Shell / Bash" },
  { id: "yaml", label: "YAML" },
  { id: "json", label: "JSON" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "dockerfile", label: "Dockerfile" },
  { id: "markdown", label: "Markdown" },
] as const;

interface CodeSnippetFieldProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  onLanguageChange: (language: string) => void;
}

export function CodeSnippetField({
  value,
  language,
  onChange,
  onLanguageChange,
}: CodeSnippetFieldProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/90 px-3 py-2">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <Code2 className="size-4 text-blue-400" />
          Code snippet
        </span>

        <Select
          value={language}
          onValueChange={(value) => value && onLanguageChange(value)}
        >
          <SelectTrigger className="h-8 w-40 rounded-lg border-slate-700 bg-slate-800 text-sm font-medium text-slate-200">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white p-1">
            {CODE_LANGUAGES.map((lang) => (
              <SelectItem
                key={lang.id}
                value={lang.id}
                className="cursor-pointer rounded-lg py-2 text-sm font-medium"
              >
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <MonacoEditor
        height={220}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(next) => onChange(next ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          tabSize: 2,
          wordWrap: "on",
          renderLineHighlight: "none",
          scrollbar: { vertical: "auto", horizontal: "auto" },
        }}
      />
    </div>
  );
}
