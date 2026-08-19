"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Mail,
  ArrowRight,
  ArrowLeftRight,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiSpringboot,
  SiPostgresql,
  SiRedis,
  SiMinio,
  SiTraefikproxy,
} from "react-icons/si";

export function SystemArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl">
      {/* ─── Title Section ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-6 mb-8 sm:mb-12">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Official Architecture Blueprint
            </span>
          </div>
          <h3 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            DevSolve End-to-End Architecture
          </h3>
        </div>

        <div className="text-right">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2563EB] dark:text-blue-400">
            System Architecture
          </span>
        </div>
      </div>

      {/* ─── DESKTOP DIAGRAM CANVAS (>= 1024px) ─── */}
      <div className="relative mx-auto hidden lg:block w-full max-w-[1020px] h-[640px] select-none">
        {/* ─── SVG CONNECTIONS & ARROW PATHS ─── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 1020 640"
        >
          <defs>
            <marker
              id="arrow-head"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="currentColor" className="text-slate-400 dark:text-neutral-500" />
            </marker>

            <marker
              id="arrow-head-active"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2563EB" />
            </marker>
          </defs>

          {/* 1. User -> Reverse Proxy */}
          <path
            d="M 125 110 L 215 110"
            fill="none"
            stroke="currentColor"
            className="text-slate-300 dark:text-neutral-700"
            strokeWidth="2"
            markerEnd="url(#arrow-head)"
          />

          {/* 2. Reverse Proxy -> Frontend (Down) */}
          <path
            d="M 245 165 L 245 270"
            fill="none"
            stroke="currentColor"
            className="text-slate-300 dark:text-neutral-700"
            strokeWidth="2"
            markerEnd="url(#arrow-head)"
          />

          {/* 3. Reverse Proxy -> Keycloak (Right) */}
          <path
            d="M 335 110 L 450 110"
            fill="none"
            stroke="currentColor"
            className="text-slate-300 dark:text-neutral-700"
            strokeWidth="2"
            markerEnd="url(#arrow-head)"
          />

          {/* 4. Frontend -> Keycloak (OAuth / Session) */}
          <path
            d="M 345 300 Q 400 240 455 165"
            fill="none"
            stroke="currentColor"
            className="text-slate-300 dark:text-neutral-700"
            strokeWidth="2"
            markerEnd="url(#arrow-head)"
          />

          {/* 5. Frontend -> Spring Boot (REST / HTTPS) */}
          <path
            d="M 350 350 L 455 350"
            fill="none"
            stroke="currentColor"
            className="text-slate-400 dark:text-neutral-600"
            strokeWidth="2"
            markerEnd="url(#arrow-head)"
          />

          {/* 6. Keycloak <-> Spring Boot (VALIDATE JWT) */}
          <path
            d="M 580 180 L 580 270"
            fill="none"
            stroke="currentColor"
            className="text-slate-400 dark:text-neutral-600"
            strokeWidth="2"
            markerStart="url(#arrow-head)"
            markerEnd="url(#arrow-head)"
          />

          {/* 7. Spring Boot -> Notification (Events) */}
          <path
            d="M 700 320 Q 730 240 780 180"
            fill="none"
            stroke="currentColor"
            className="text-slate-300 dark:text-neutral-700"
            strokeWidth="2"
            markerStart="url(#arrow-head)"
            markerEnd="url(#arrow-head)"
          />

          {/* 8. Spring Boot <-> PostgreSQL */}
          <path
            d="M 710 350 L 780 350"
            fill="none"
            stroke="currentColor"
            className="text-slate-400 dark:text-neutral-600"
            strokeWidth="2"
            markerStart="url(#arrow-head)"
            markerEnd="url(#arrow-head)"
          />

          {/* 9. Spring Boot -> Meilisearch */}
          <path
            d="M 640 405 Q 640 500 780 500"
            fill="none"
            stroke="currentColor"
            className="text-slate-300 dark:text-neutral-700"
            strokeWidth="2"
            markerEnd="url(#arrow-head)"
          />

          {/* 10. Spring Boot -> Redis (Down) */}
          <path
            d="M 580 405 L 580 470"
            fill="none"
            stroke="currentColor"
            className="text-slate-400 dark:text-neutral-600"
            strokeWidth="2"
            markerEnd="url(#arrow-head)"
          />

          {/* 11. Spring Boot -> VirusTotal */}
          <path
            d="M 530 405 Q 530 500 450 500"
            fill="none"
            stroke="currentColor"
            className="text-slate-300 dark:text-neutral-700"
            strokeWidth="2"
            markerStart="url(#arrow-head)"
            markerEnd="url(#arrow-head)"
          />

          {/* 12. VirusTotal -> MinIO */}
          <path
            d="M 285 500 L 210 500"
            fill="none"
            stroke="currentColor"
            className="text-slate-400 dark:text-neutral-600"
            strokeWidth="2"
            markerEnd="url(#arrow-head)"
          />
        </svg>

        {/* ─── DIAGRAM LABELS OVER PATHS ─── */}
        {/* REST / HTTPS Label */}
        <div className="absolute left-[360px] top-[325px] z-10 flex flex-col items-center bg-card/90 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-slate-700 dark:text-neutral-300 border border-border/60 shadow-xs">
          <span>REST</span>
          <span>/HTTPS</span>
        </div>

        {/* VALIDATE JWT Label */}
        <div className="absolute left-[520px] top-[205px] z-10 flex flex-col items-center bg-card/90 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold text-slate-700 dark:text-neutral-300 border border-border/60 shadow-xs">
          <span>VALIDATE JWT</span>
        </div>

        {/* Events Label */}
        <div className="absolute left-[725px] top-[225px] z-10 bg-card/90 px-2 py-0.5 rounded text-[11px] font-mono font-semibold text-slate-600 dark:text-neutral-400 border border-border/60 shadow-xs">
          Events
        </div>

        {/* ─── NODE 1: USER ─── */}
        <div
          className="absolute left-[35px] top-[60px] z-20 flex flex-col items-center group cursor-pointer"
          onMouseEnter={() => setActiveNode("user")}
          onMouseLeave={() => setActiveNode(null)}
        >
          <div className="flex size-20 items-center justify-center rounded-full bg-slate-100 border border-border shadow-md transition-transform group-hover:scale-105 dark:bg-neutral-800">
            <div className="flex size-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-inner">
              <User className="size-8" />
            </div>
          </div>
          <span className="mt-2 text-sm font-bold text-foreground">User</span>
        </div>

        {/* ─── NODE 2: REVERSE PROXY (TRAEFIK) ─── */}
        <div
          className="absolute left-[215px] top-[45px] z-20 flex w-32 flex-col items-center rounded-3xl border border-border bg-card p-3 shadow-md transition-all hover:scale-105 hover:shadow-lg dark:border-neutral-800 cursor-pointer"
          onMouseEnter={() => setActiveNode("proxy")}
          onMouseLeave={() => setActiveNode(null)}
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500">
            <SiTraefikproxy className="size-8" />
          </div>
          <span className="mt-1 text-[11px] font-bold tracking-wider text-cyan-600 dark:text-cyan-400">traefik</span>
          <span className="mt-1 text-xs font-bold text-foreground">Reverse Proxy</span>
        </div>

        {/* ─── NODE 3: FRONTEND (NEXT.JS + SHADCN + TAILWIND) ─── */}
        <div
          className="absolute left-[35px] top-[270px] z-20 flex w-80 flex-col items-center rounded-3xl border border-border bg-card p-5 shadow-md transition-all hover:scale-102 hover:shadow-lg dark:border-neutral-800 cursor-pointer"
          onMouseEnter={() => setActiveNode("frontend")}
          onMouseLeave={() => setActiveNode(null)}
        >
          {/* Next.js Header */}
          <div className="flex items-center gap-2">
            <SiNextdotjs className="size-7 text-foreground" />
            <span className="text-xl font-extrabold tracking-tight text-foreground">NEXT<span className="text-xs">.JS</span></span>
          </div>

          {/* Sub-frameworks */}
          <div className="mt-3 flex items-center gap-3 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1 font-mono">
              <span className="text-slate-400">//</span> shadcn/ui
            </span>
            <span className="flex items-center gap-1 text-[#06B6D4] font-semibold">
              <SiTailwindcss className="size-3.5" /> tailwindcss
            </span>
          </div>

          <span className="mt-3 text-sm font-bold text-foreground">Frontend</span>
        </div>

        {/* ─── NODE 4: AUTHORIZATION SERVER (KEYCLOAK + JWT + OAUTH2) ─── */}
        <div
          className="absolute left-[450px] top-[45px] z-20 flex w-64 flex-col items-center rounded-3xl border border-border bg-card p-4 shadow-md transition-all hover:scale-102 hover:shadow-lg dark:border-neutral-800 cursor-pointer"
          onMouseEnter={() => setActiveNode("auth")}
          onMouseLeave={() => setActiveNode(null)}
        >
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-cyan-600 text-white font-bold text-xs">
              KC
            </div>
            <span className="text-base font-extrabold tracking-wider text-slate-800 dark:text-neutral-200">KEYCLOAK</span>
          </div>

          {/* JWT + OAuth2 Badges */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1 rounded bg-pink-50 dark:bg-pink-500/10 px-2 py-0.5 text-[11px] font-bold text-pink-600 dark:text-pink-400">
              <span className="text-xs font-extrabold">*</span> JWT
            </div>
            <div className="flex size-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-white dark:text-slate-900">
              2
            </div>
          </div>

          <span className="mt-2 text-xs font-bold text-foreground">Authorization Server</span>
        </div>

        {/* ─── NODE 5: SPRING BOOT RESTFUL API (CORE HUB) ─── */}
        <div
          className="absolute left-[460px] top-[270px] z-20 flex w-64 flex-col items-center rounded-3xl border-2 border-emerald-500/60 bg-card p-5 shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:bg-neutral-900/90 cursor-pointer ring-4 ring-emerald-500/10"
          onMouseEnter={() => setActiveNode("core")}
          onMouseLeave={() => setActiveNode(null)}
        >
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <SiSpringboot className="size-8" />
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-extrabold tracking-tight">spring</span>
              <span className="text-xs font-bold -mt-1">boot</span>
            </div>
          </div>

          <span className="mt-3 text-sm font-bold font-mono text-foreground">RESTful API</span>
        </div>

        {/* ─── NODE 6: SMTP NOTIFICATION ─── */}
        <div
          className="absolute left-[780px] top-[60px] z-20 flex w-48 flex-col items-center rounded-3xl border border-border bg-card p-4 shadow-md transition-all hover:scale-105 hover:shadow-lg dark:border-neutral-800 cursor-pointer"
          onMouseEnter={() => setActiveNode("smtp")}
          onMouseLeave={() => setActiveNode(null)}
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-lime-50 dark:bg-lime-500/10 text-lime-600 dark:text-lime-400">
            <Mail className="size-6" />
          </div>
          <span className="mt-2 text-sm font-extrabold tracking-wider text-slate-800 dark:text-neutral-200">SMTP</span>
          <span className="text-xs font-bold text-muted-foreground">Notification</span>
        </div>

        {/* ─── NODE 7: POSTGRESQL DATABASE ─── */}
        <div
          className="absolute left-[780px] top-[275px] z-20 flex w-48 flex-col items-center rounded-3xl border border-border bg-card p-4 shadow-md transition-all hover:scale-105 hover:shadow-lg dark:border-neutral-800 cursor-pointer"
          onMouseEnter={() => setActiveNode("db")}
          onMouseLeave={() => setActiveNode(null)}
        >
          <div className="flex items-center gap-2 text-[#4169E1]">
            <SiPostgresql className="size-8" />
            <span className="text-sm font-bold text-foreground">PostgreSQL</span>
          </div>
          <span className="mt-2 text-xs font-bold text-muted-foreground">Database</span>
        </div>

        {/* ─── NODE 8: MEILISEARCH ─── */}
        <div
          className="absolute left-[780px] top-[450px] z-20 flex w-48 flex-col items-center rounded-3xl border border-border bg-card p-4 shadow-md transition-all hover:scale-105 hover:shadow-lg dark:border-neutral-800 cursor-pointer"
          onMouseEnter={() => setActiveNode("search")}
          onMouseLeave={() => setActiveNode(null)}
        >
          <div className="flex items-center gap-2 text-[#FF406E]">
            <span className="text-lg font-black italic">///</span>
            <span className="text-sm font-extrabold text-foreground tracking-tight">meilisearch</span>
          </div>
          <span className="mt-2 text-xs font-bold text-muted-foreground">Search Service</span>
        </div>

        {/* ─── NODE 9: REDIS (CACHE & QUEUE) ─── */}
        <div
          className="absolute left-[480px] top-[460px] z-20 flex w-56 flex-col items-center rounded-3xl border border-border bg-card p-4 shadow-md transition-all hover:scale-105 hover:shadow-lg dark:border-neutral-800 cursor-pointer"
          onMouseEnter={() => setActiveNode("redis")}
          onMouseLeave={() => setActiveNode(null)}
        >
          <div className="flex items-center gap-2 text-[#DC382D]">
            <SiRedis className="size-7" />
            <span className="text-lg font-extrabold text-foreground">redis</span>
          </div>
          <span className="mt-2 text-xs font-bold text-muted-foreground">Cache & Queue</span>
        </div>

        {/* ─── NODE 10: VIRUSTOTAL (FILE UPLOAD SCAN) ─── */}
        <div
          className="absolute left-[285px] top-[460px] z-20 flex w-44 flex-col items-center rounded-3xl border border-border bg-card p-4 shadow-md transition-all hover:scale-105 hover:shadow-lg dark:border-neutral-800 cursor-pointer"
          onMouseEnter={() => setActiveNode("scan")}
          onMouseLeave={() => setActiveNode(null)}
        >
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-extrabold tracking-wider text-xs">
            <span className="text-base font-black">Σ</span> VIRUSTOTAL
          </div>
          <span className="mt-2 text-xs font-bold text-muted-foreground">File Upload Scan</span>
        </div>

        {/* ─── NODE 11: MINIO (FILE STORAGE) ─── */}
        <div
          className="absolute left-[35px] top-[460px] z-20 flex w-44 flex-col items-center rounded-3xl border border-border bg-card p-4 shadow-md transition-all hover:scale-105 hover:shadow-lg dark:border-neutral-800 cursor-pointer"
          onMouseEnter={() => setActiveNode("minio")}
          onMouseLeave={() => setActiveNode(null)}
        >
          <div className="flex items-center gap-1.5 text-[#C72C48] font-bold text-sm">
            <SiMinio className="size-6" />
            <span className="font-extrabold tracking-wider">MINIO</span>
          </div>
          <span className="mt-2 text-xs font-bold text-muted-foreground">File Storage</span>
        </div>
      </div>

      {/* ─── MOBILE & TABLET RESPONSIVE CARDS VIEW (< 1024px) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
        {[
          {
            title: "Frontend Layer",
            role: "Next.js 16 + shadcn/ui + Tailwind CSS",
            desc: "Client-side & SSR presentation layer interacting via authenticated REST/HTTPS proxy.",
          },
          {
            title: "Reverse Proxy",
            role: "Traefik",
            desc: "Ingress controller routing user traffic, SSL termination, and rate limiting.",
          },
          {
            title: "Authorization Server",
            role: "Keycloak OIDC + JWT + OAuth 2.0",
            desc: "Centralized identity provider validating credentials and issuing secure JWT session tokens.",
          },
          {
            title: "Core Backend Hub",
            role: "Spring Boot RESTful API",
            desc: "Central business engine orchestrating reports, triage validations, and database transactions.",
          },
          {
            title: "Primary Datastore",
            role: "PostgreSQL Database",
            desc: "ACID relational persistence for programs, user metrics, reports, and bounties.",
          },
          {
            title: "Cache & Queue",
            role: "Redis",
            desc: "In-memory cache bus for instant session validation, leaderboards, and message queues.",
          },
          {
            title: "Malware Scanning",
            role: "VirusTotal Scan Pipeline",
            desc: "Automated real-time attachment and file submission security checks.",
          },
          {
            title: "Object Storage",
            role: "MinIO S3",
            desc: "S3-compatible distributed storage for challenge files, proofs-of-concept, and assets.",
          },
          {
            title: "Search Service",
            role: "Meilisearch",
            desc: "Sub-50ms typo-tolerant search across all public programs and technical write-ups.",
          },
          {
            title: "Notification Dispatch",
            role: "SMTP Service",
            desc: "Real-time event notification pipeline for report updates and security alerts.",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {card.title}
            </span>
            <h4 className="text-base font-bold text-foreground">{card.role}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
