"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Send, Plus, X, Loader2, Image as ImageIcon, Link as LinkIcon, AlertCircle } from "lucide-react";
import { useCreateDiscussionMutation } from "@/lib/redux/services/discussionsApi";
import type { TopicFilter } from "@/lib/types/dicussion/types";

const TOPIC_OPTIONS: TopicFilter[] = [
  "Program Design",
  "Authentication",
  "API Security",
  "JavaScript",
  "Server-Side",
  "Cryptography",
];

export function CreateShowcaseForm() {
  const router = useRouter();
  const [createDiscussion, { isLoading, error }] = useCreateDiscussionMutation();

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState<TopicFilter>("Program Design");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80"
  );
  const [techInput, setTechInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>(["#react", "#nextjs", "#firebase"]);

  const handleAddTech = () => {
    let t = techInput.trim();
    if (!t) return;
    if (!t.startsWith("#")) t = `#${t}`;
    if (!techStack.includes(t)) {
      setTechStack([...techStack, t]);
    }
    setTechInput("");
  };

  const handleRemoveTech = (itemToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== itemToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      const res = await createDiscussion({
        title: title.trim(),
        category: "Showcase",
        topic,
        description: description.trim(),
        tags: ["#showcase", ...techStack],
        techStack,
        thumbnailUrl: thumbnailUrl.trim() || undefined,
      }).unwrap();

      if (res?.id) {
        router.push("/discussions");
      }
    } catch (err) {
      console.error("Failed to create showcase post:", err);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onSubmit={handleSubmit}
      className="space-y-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-3xl mx-auto"
    >
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-base font-medium">
          <AlertCircle className="size-5 shrink-0" />
          <span>Failed to submit post. Please try again.</span>
        </div>
      )}

      {/* 1. Title */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="showcase-title" className="text-base font-bold text-slate-900">
            Showcase Title <span className="text-red-500">*</span>
          </label>
          <span className="text-sm text-slate-500 font-medium">
            {title.length}/150
          </span>
        </div>
        <input
          id="showcase-title"
          type="text"
          maxLength={150}
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Interactive OAuth Security Architecture Flow & POC Playground"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
        />
      </div>

      {/* 2. Topic Category */}
      <div className="space-y-2">
        <label htmlFor="showcase-topic" className="text-base font-bold text-slate-900">
          Topic Category <span className="text-red-500">*</span>
        </label>
        <select
          id="showcase-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value as TopicFilter)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-800 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
        >
          {TOPIC_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Description & Architecture Overview */}
      <div className="space-y-2">
        <label htmlFor="showcase-description" className="text-base font-bold text-slate-900">
          Architecture Overview & Details <span className="text-red-500">*</span>
        </label>
        <textarea
          id="showcase-description"
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project architecture, key features, technology stack, and demo instructions..."
          className="w-full rounded-xl border border-slate-300 bg-white p-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 leading-relaxed"
        />
      </div>

      {/* 4. Thumbnail Image URL & Preview */}
      <div className="space-y-3">
        <label htmlFor="showcase-thumbnail" className="text-base font-bold text-slate-900">
          Thumbnail Image URL
        </label>
        <div className="relative">
          <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 pointer-events-none" />
          <input
            id="showcase-thumbnail"
            type="url"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
          />
        </div>
        {thumbnailUrl && (
          <div className="flex gap-4 items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
            <img
              src={thumbnailUrl}
              alt="Thumbnail preview"
              className="h-20 w-32 object-cover rounded-lg border border-slate-200 shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <span className="text-sm font-semibold text-slate-600">Thumbnail Preview</span>
          </div>
        )}
      </div>

      {/* 5. Tech Stack Builder */}
      <div className="space-y-2">
        <label className="text-base font-bold text-slate-900">Tech Stack Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTech();
              }
            }}
            placeholder="Add technology (e.g. #react, #firebase)..."
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
          />
          <button
            type="button"
            onClick={handleAddTech}
            className="rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 px-4 py-2.5 text-base font-bold text-slate-800 transition-colors"
          >
            <Plus className="size-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {techStack.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 border border-purple-200 px-3 py-1 text-sm font-mono font-bold text-purple-800"
            >
              <span>{t}</span>
              <button
                type="button"
                onClick={() => handleRemoveTech(t)}
                className="text-purple-600 hover:text-purple-900 transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => router.push("/discussions")}
          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-base font-bold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !title.trim() || !description.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-6 py-2.5 text-base font-bold text-white shadow-md transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <Send className="size-5 stroke-[2.5]" />
              <span>Publish Showcase</span>
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}
