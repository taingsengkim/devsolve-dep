"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  Lock,
  Plus,
  Sliders,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function ContentModerationPage() {
  const [autoSpamFilter, setAutoSpamFilter] = useState(true);
  const [zeroDayProtection, setZeroDayProtection] = useState(true);
  const [profanityFilter, setProfanityFilter] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Admin Platform / System Controls</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Platform Content & Security Filters
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure automated content filters, zero-day disclosure rules, blacklisted keywords, and platform guardrails.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              Automated Guardrail Controls
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Systemic filters automatically enforced on public forums and solution showcases.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">AI Spam & Phishing Detection</h4>
                <p className="text-xs text-slate-500">Flag suspicious links or automated spam patterns.</p>
              </div>
              <Switch checked={autoSpamFilter} onCheckedChange={setAutoSpamFilter} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Unverified Zero-Day Disclosure Block</h4>
                <p className="text-xs text-slate-500">Prevent unconfirmed zero-day exploits from being posted publicly.</p>
              </div>
              <Switch checked={zeroDayProtection} onCheckedChange={setZeroDayProtection} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Toxic & Harassment Filter</h4>
                <p className="text-xs text-slate-500">Automatically filter abusive language in comments and discussions.</p>
              </div>
              <Switch checked={profanityFilter} onCheckedChange={setProfanityFilter} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-rose-600" />
              Blacklisted Keyword Management
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Keywords or regex patterns that trigger instant moderation flags.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input placeholder="Add new blacklisted keyword or regex..." className="h-10 bg-white border-slate-300 rounded-xl text-sm" />
              <Button className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 cursor-pointer shrink-0">
                <Plus className="w-4 h-4 mr-1" /> Add Rule
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {["0day-exploit-sale", "leak-database-dump", "wallet-drainer", "buy-verified-kyb"].map((word) => (
                <Badge key={word} variant="outline" className="rounded-lg px-3 py-1 text-xs font-mono bg-slate-50 border-slate-300 text-slate-700">
                  {word}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
