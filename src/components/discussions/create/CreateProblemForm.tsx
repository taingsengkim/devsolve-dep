"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Send, Plus, X, Loader2, AlertCircle } from "lucide-react";
import { useCreateDiscussionMutation } from "@/lib/redux/services/discussionsApi";
import type { TopicFilter } from "@/lib/types/dicussion/types";

const TOPIC_OPTIONS: TopicFilter[] = [
  "Authentication",
  "Server-Side",
  "JavaScript",
  "API Security",
  "Cryptography",
  "Program Design",
];

export function CreateProblemForm() {
  const router = useRouter();
  const [createDiscussion, { isLoading, error }] = useCreateDiscussionMutation();

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState<TopicFilter>("Authentication");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["#jwt", "#oauth"]);
  const [codeSnippet, setCodeSnippet] = useState("");

  const handleAddTag = () => {
    let t = tagInput.trim();
    if (!t) return;
    if (!t.startsWith("#")) t = `#${t}`;
    if (!tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      const res = await createDiscussion({
        title: title.trim(),
        category: "Problems",
        topic,
        description: description.trim(),
        tags,
        codeSnippet: codeSnippet.trim() || undefined,
      }).unwrap();

      if (res?.id) {
        router.push("/discussions");
      }
    } catch (err) {
      console.error("Failed to create problem post:", err);
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
          <label htmlFor="post-title" className="text-base font-bold text-slate-900">
            Problem Title <span className="text-red-500">*</span>
          </label>
          <span className="text-sm text-slate-500 font-medium">
            {title.length}/150
          </span>
        </div>
        <input
          id="post-title"
          type="text"
          maxLength={150}
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. JWT token leaks via Referer header on OAuth redirect"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
        />
      </div>

      {/* 2. Topic Category */}
      <div className="space-y-2">
        <label htmlFor="post-topic" className="text-base font-bold text-slate-900">
          Topic Category <span className="text-red-500">*</span>
        </label>
        <select
          id="post-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value as TopicFilter)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
        >
          {TOPIC_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Detailed Description */}
      <div className="space-y-2">
        <label htmlFor="post-description" className="text-base font-bold text-slate-900">
          Problem Description & Context <span className="text-red-500">*</span>
        </label>
        <textarea
          id="post-description"
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue, step to reproduce, expected behavior, or security impact..."
          className="w-full rounded-xl border border-slate-300 bg-white p-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 leading-relaxed"
        />
      </div>

      {/* 4. Code Snippet (Optional) */}
      <div className="space-y-2">
        <label htmlFor="post-code" className="text-base font-bold text-slate-900">
          Code Snippet / PoC Payload <span className="text-sm font-normal text-slate-500">(Optional)</span>
        </label>
        <textarea
          id="post-code"
          rows={4}
          value={codeSnippet}
          onChange={(e) => setCodeSnippet(e.target.value)}
          placeholder="// Paste vulnerable code snippet or PoC payload here..."
          className="w-full rounded-xl border border-slate-300 bg-slate-900 p-4 font-mono text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 leading-relaxed"
        />
      </div>

      {/* 5. Tags Builder */}
      <div className="space-y-2">
        <label className="text-base font-bold text-slate-900">Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Add tag (e.g. #ssrf, #jwt)..."
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 px-4 py-2.5 text-base font-bold text-slate-800 transition-colors"
          >
            <Plus className="size-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1 text-sm font-mono font-bold text-blue-800"
            >
              <span>{t}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(t)}
                className="text-blue-600 hover:text-blue-900 transition-colors"
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
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2.5 text-base font-bold text-white shadow-md transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <Send className="size-5 stroke-[2.5]" />
              <span>Publish Problem</span>
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}
