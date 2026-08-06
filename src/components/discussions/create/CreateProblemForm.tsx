"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Plus,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MarkdownEditor } from "@/components/reports/MarkdownEditor";
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

const POPULAR_TAGS = [
  "#jwt",
  "#oauth",
  "#xss",
  "#sqli",
  "#cors",
  "#ssrf",
  "#auth-bypass",
  "#rate-limit",
];

interface CreateProblemFormProps {
  cancelHref?: string;
}

export function CreateProblemForm({ cancelHref = "/problems" }: CreateProblemFormProps) {
  const router = useRouter();
  const [createDiscussion, { isLoading, error }] = useCreateDiscussionMutation();

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState<TopicFilter>("Authentication");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["#jwt", "#oauth"]);
  const [codeSnippet, setCodeSnippet] = useState("");

  const handleAddTag = (rawTag?: string) => {
    let t = (rawTag || tagInput).trim();
    if (!t) return;
    if (!t.startsWith("#")) t = `#${t}`;
    if (!tags.includes(t)) {
      setTags([...tags, t]);
    }
    if (!rawTag) setTagInput("");
  };

  const handleToggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
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
        router.push(cancelHref);
      }
    } catch (err) {
      console.error("Failed to create problem post:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Main Form Controls */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 text-red-700 border border-red-200 text-base font-medium shadow-xs"
            >
              <AlertCircle className="size-5 shrink-0" />
              <span>Failed to submit post. Please check your network connection and try again.</span>
            </motion.div>
          )}

          {/* Main Problem Details Card */}
          <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
            {/*  */}
            <CardContent className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="problem-title" className="text-base font-bold text-slate-900">
                    Problem Title
                  </label>
                  <Badge variant="secondary" className="font-semibold text-xs text-slate-600 bg-slate-100">
                    {title.length}/150
                  </Badge>
                </div>
                <Input
                  id="problem-title"
                  type="text"
                  maxLength={150}
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. JWT token leaks via Referer header on OAuth redirect flow"
                  className="h-12 rounded-xl border-slate-300 bg-white px-4 text-base text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-600/20"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label htmlFor="problem-description" className="text-base font-bold text-slate-900 block">
                  Description
                </label>
                <MarkdownEditor
                  value={description}
                  onChange={(val) => setDescription(val || "")}
                  placeholder="Describe the problem in detail using Markdown. Include reproduction steps, environment details, or code blocks..."
                  height={480}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar Column: Settings & Actions */}
        <div className="space-y-6 sticky top-6">
          {/* Topic Category Card */}
          <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900">
                Topic Category
              </CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Categorize your discussion for targeted visibility.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={topic}
                onValueChange={(val) => {
                  if (val) setTopic(val as TopicFilter);
                }}
              >
                <SelectTrigger className="w-full rounded-xl border-slate-300 bg-white px-4 text-base font-semibold text-slate-800 h-12">
                  <SelectValue placeholder="Select topic category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-md rounded-xl p-1">
                  <SelectGroup>
                    {TOPIC_OPTIONS.map((opt) => (
                      <SelectItem
                        key={opt}
                        value={opt}
                        className="text-base font-medium cursor-pointer rounded-lg py-2.5 px-3 hover:bg-slate-50 focus:bg-slate-50"
                      >
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tags & Keywords Card */}
          <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
            <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold text-slate-900">
                  Tags & Keywords
                </CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  Add relevant security or technical tags.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-semibold text-slate-600">
                {tags.length} selected
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Input Tag */}
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add custom tag (e.g. #jwt)..."
                  className="h-10 flex-1 rounded-xl border-slate-300 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-600/20"
                />
                <Button
                  type="button"
                  onClick={() => handleAddTag()}
                  size="sm"
                  className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-3.5"
                >
                  <Plus className="size-4" />
                  <span>Add</span>
                </Button>
              </div>

              {/* Quick Tag Pills */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-500">Popular Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TAGS.map((pt) => {
                    const isSelected = tags.includes(pt);
                    return (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => handleToggleTag(pt)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-2xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {pt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Tags Display */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  <AnimatePresence>
                    {tags.map((t) => (
                      <motion.span
                        key={t}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-mono font-bold text-blue-800"
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <X className="size-3" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Actions Card */}
          <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
            <CardContent className="p-6 space-y-3">
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !title.trim() || !description.trim()}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-base font-bold text-white shadow-md transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    <span>Publishing Post...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-5 stroke-[2.5]" />
                    <span>Publish</span>
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.push(cancelHref)}
                className="w-full h-11 rounded-xl border-slate-300 bg-white text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
