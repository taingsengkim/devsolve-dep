"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { MessageSquare, Code2, Lightbulb, ThumbsUp, ChevronRight } from "lucide-react";

const discussions = [
  {
    type: "Problem",
    icon: Code2,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    title: "How to bypass SSRF protections in AWS metadata service?",
    tags: ["Security", "AWS", "SSRF"],
    replies: 34,
    upvotes: 127,
    timeAgo: "2h ago",
    author: "0xShadow",
    authorGradient: "from-blue-400 to-indigo-500",
  },
  {
    type: "Showcase",
    icon: Lightbulb,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "Full writeup: RCE via deserialization in Java enterprise app",
    tags: ["Java", "RCE", "Writeup"],
    replies: 21,
    upvotes: 89,
    timeAgo: "5h ago",
    author: "BugHunterX",
    authorGradient: "from-emerald-400 to-teal-500",
  },
  {
    type: "Question",
    icon: MessageSquare,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Best methodology for mobile app penetration testing in 2025?",
    tags: ["Mobile", "Pentest", "Android"],
    replies: 58,
    upvotes: 203,
    timeAgo: "1d ago",
    author: "h4xor99",
    authorGradient: "from-orange-400 to-red-500",
  },
];

const TYPE_COLORS: Record<string, string> = {
  Problem: "bg-red-50 text-red-700 border-red-200",
  Showcase: "bg-purple-50 text-purple-700 border-purple-200",
  Question: "bg-blue-50 text-blue-700 border-blue-200",
};

function DiscussionRow({
  item,
  index,
}: {
  item: (typeof discussions)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = item.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href="/discussions"
        className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200"
      >
        <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <Icon className={`w-5 h-5 ${item.iconColor}`} />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${TYPE_COLORS[item.type]}`}>
              {item.type}
            </span>
            {item.tags.map((t) => (
              <span key={t} className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>

          <p className="text-base font-semibold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
            {item.title}
          </p>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${item.authorGradient}`} />
              <span>{item.author}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{item.replies}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{item.upvotes}</span>
            </div>
            <span>·</span>
            <span>{item.timeAgo}</span>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
      </Link>
    </motion.div>
  );
}

export function DiscussionsTeaser() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">

          {/* Left: header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 space-y-5 lg:sticky lg:top-24"
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-200/60 px-3 py-1 rounded-full">
              Community
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
              Post problems.
              <br />
              Share solutions.
            </h2>
            <p className="text-base text-slate-500 leading-relaxed">
              DevSolve's discussion platform is built for technical depth. Ask questions,
              share write-ups, and connect with researchers who speak your language.
            </p>

            {/* Mini stats */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                { value: "24", label: "Categories" },
                { value: "1,300+", label: "Discussions" },
                { value: "128+", label: "Contributors" },
                { value: "3,400+", label: "Replies" },
              ].map((s) => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xl font-black text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/discussions"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-sm transition-colors group"
            >
              Explore discussions
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {/* Right: discussion list */}
          <div className="lg:col-span-3 space-y-3">
            {discussions.map((d, i) => (
              <DiscussionRow key={d.title} item={d} index={i} />
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center pt-2"
            >
              <Link
                href="/discussions"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                See all discussions →
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DiscussionsTeaser;
