"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Send, Plus, X, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
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
import {
  useCreateDiscussionMutation,
  useGetDiscussionCategoriesQuery,
} from "@/lib/redux/services/discussionsApi";

export function CreateShowcaseForm() {
  const router = useRouter();
  const [createDiscussion, { isLoading, error }] = useCreateDiscussionMutation();
  const { data: categories = [], isLoading: isLoadingCategories } =
    useGetDiscussionCategoriesQuery("SHOWCASE");

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
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
        categoryId,
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
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Details */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 text-red-700 border border-red-200 text-base font-medium shadow-xs"
            >
              <AlertCircle className="size-5 shrink-0" />
              <span>Failed to submit showcase post. Please check your connection and try again.</span>
            </motion.div>
          )}

          {/* Main Showcase Card */}
          <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
           
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="showcase-title" className="text-base font-bold text-slate-900">
                    Showcase Title
                  </label>
                  <Badge variant="secondary" className="font-semibold text-xs text-slate-600 bg-slate-100">
                    {title.length}/150
                  </Badge>
                </div>
                <Input
                  id="showcase-title"
                  type="text"
                  maxLength={150}
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Interactive OAuth Security Architecture Flow & POC Playground"
                  className="h-12 rounded-xl border-slate-300 bg-white px-4 text-base text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-600/20"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="showcase-description" className="text-base font-bold text-slate-900 block">
                  Architecture Overview & Details
                </label>
                <MarkdownEditor
                  value={description}
                  onChange={(val) => setDescription(val || "")}
                  placeholder="Describe your project architecture, key features, technology stack, and demo instructions using Markdown..."
                  height={440}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar Column: Settings & Media */}
        <div className="space-y-6 sticky top-6">
          {/* Topic Category Card */}
          <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900">
                Topic Category
              </CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Select the primary technology topic.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={categoryId}
                onValueChange={(val) => setCategoryId(val || undefined)}
                disabled={isLoadingCategories || categories.length === 0}
              >
                <SelectTrigger className="w-full rounded-xl border-slate-300 bg-white px-4 text-base font-semibold text-slate-800 h-12">
                  <SelectValue placeholder={isLoadingCategories ? "Loading topics..." : "Select topic"} />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-md rounded-xl p-1">
                  <SelectGroup>
                    {categories.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id} className="text-base font-medium cursor-pointer rounded-lg py-2.5 px-3">
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Thumbnail Image Card */}
          <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900">
                Thumbnail Image
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Provide a cover image URL for your showcase.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <Input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="h-10 pl-10 pr-3 rounded-xl border-slate-300 text-sm focus-visible:ring-2 focus-visible:ring-blue-600/20"
                />
              </div>
              {thumbnailUrl && (
                <div className="flex gap-3 items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail preview"
                    className="h-14 w-24 object-cover rounded-lg border border-slate-200 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <span className="text-xs font-semibold text-slate-600">Cover Preview</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tech Stack Tags Card */}
          <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
            <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold text-slate-900">
                  Tech Stack Tags
                </CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  Technologies used in this project.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-semibold text-slate-600">
                {techStack.length}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                  placeholder="Add tech (e.g. #react)..."
                  className="h-10 flex-1 rounded-xl border-slate-300 bg-white px-3.5 text-sm"
                />
                <Button
                  type="button"
                  onClick={handleAddTech}
                  size="sm"
                  className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-3.5"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <AnimatePresence>
                  {techStack.map((t) => (
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
                        onClick={() => handleRemoveTech(t)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
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
                    <span>Publishing Showcase...</span>
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
                onClick={() => router.push("/discussions")}
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
