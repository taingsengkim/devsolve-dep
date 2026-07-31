"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { ShieldAlert, Award, Heart, Sparkles, ExternalLink } from "lucide-react";

interface Disclosure {
  id: string;
  title: string;
  handle: string;
  avatarUrl: string;
  program: string;
  bounty: string;
  severity: "Critical" | "High";
  category: string;
  upvotes: number;
}

const FEATURED_ITEMS: Disclosure[] = [
  {
    id: "f1",
    title: "Unauthenticated Remote Code Execution in Core Gateway Engine",
    handle: "darkp4tch",
    avatarUrl: "https://i.pinimg.com/736x/28/58/cf/2858cf0eedebed2c21e7d286d62e6ee9.jpg",
    program: "Vercel Infrastructure",
    bounty: "$7,500",
    severity: "Critical",
    category: "RCE",
    upvotes: 248,
  },
  {
    id: "f2",
    title: "SQL Injection via Search Parameter in Billing Dashboard API",
    handle: "n1ghtw0lf",
    avatarUrl: "https://i.pinimg.com/736x/f7/1f/54/f71f54635e921407059cd31926b74229.jpg",
    program: "Acme Payments",
    bounty: "$5,000",
    severity: "Critical",
    category: "SQLi",
    upvotes: 184,
  },
  {
    id: "f3",
    title: "Full SSRF in Webhook Integration Microservice",
    handle: "cipherqueen",
    avatarUrl: "https://i.pinimg.com/736x/f7/1f/54/f71f54635e921407059cd31926b74229.jpg",
    program: "CloudScale SaaS",
    bounty: "$3,500",
    severity: "High",
    category: "SSRF",
    upvotes: 129,
  },
];

export default function FeaturedDisclosures() {
  const [upvotes, setUpvotes] = useState<Record<string, number>>({
    f1: 248,
    f2: 184,
    f3: 129,
  });
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});

  const handleUpvote = (id: string) => {
    const isLiked = userLiked[id];
    setUserLiked((prev) => ({ ...prev, [id]: !isLiked }));
    setUpvotes((prev) => ({
      ...prev,
      [id]: isLiked ? prev[id] - 1 : prev[id] + 1,
    }));
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* <Sparkles size={18} className="text-amber-500" /> */}
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Featured Vulnerability Disclosures
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Top Disclosed Bugs
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FEATURED_ITEMS.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md"
          >
            <div>
              {/* Badges row */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    item.severity === "Critical"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  <ShieldAlert size={12} />
                  {item.severity}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200/60">
                  <Award size={12} />
                  {item.bounty}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>

              <div className="mt-2 text-xs font-medium text-slate-500">
                Target: <span className="font-semibold text-slate-800">{item.program}</span>
              </div>
            </div>

            {/* Reporter & Upvote Footer */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src={item.avatarUrl}
                  alt={`${item.handle} avatar`}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200"
                />
                <span className="text-xs font-bold text-slate-900">@{item.handle}</span>
              </div>

              <button
                type="button"
                onClick={() => handleUpvote(item.id)}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                  userLiked[item.id]
                    ? "bg-rose-50 text-rose-600 border border-rose-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Heart
                  size={13}
                  className={userLiked[item.id] ? "fill-rose-600 text-rose-600" : ""}
                />
                <span>{upvotes[item.id]}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
