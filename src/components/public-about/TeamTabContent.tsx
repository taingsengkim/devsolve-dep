"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useInk } from "@/components/landing/SectionBackdrop";
import { MemberCard, GroupLabel } from "@/components/public-about/MemberCard";
import {
  SUPERVISORS,
  STUDENT_DEVELOPERS,
} from "@/lib/types/about/mock-data";

export function TeamTabContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ink = useInk();

  useGSAP(
    () => {
      // 1. Initial set for smooth clean render
      gsap.set(".team-intro-block", { opacity: 0, x: -30 });
      gsap.set(".team-group-label", { opacity: 0, scale: 0.94, y: 15 });
      gsap.set(".mentor-card-wrapper", { opacity: 0, y: 45, scale: 0.92 });
      gsap.set(".dev-card-wrapper", { opacity: 0, y: 55, scale: 0.92 });

      // 2. Coordinated Master Timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".team-intro-block", {
        opacity: 1,
        x: 0,
        duration: 0.65,
      })
        .to(
          ".mentor-card-wrapper",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.12,
            ease: "back.out(1.2)",
          },
          "-=0.35"
        )
        .to(
          ".team-group-label",
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.2"
        )
        .to(
          ".dev-card-wrapper",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: "back.out(1.15)",
          },
          "-=0.3"
        );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full">
      {/* ─── Top Section: Title & Mentors in Unified 3-Column Grid ─── */}
      <div className="grid grid-cols-1 items-start justify-items-center gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
        {/* Column 1: Editorial Heading Block */}
        <div className="team-intro-block flex h-full w-full max-w-85 sm:max-w-90 lg:max-w-95 flex-col py-2 sm:py-4">
          <div>
            <h2
              className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-[1.12]"
              style={{ color: ink }}
            >
              Meet the people behind Devsolve
              <span className="text-[#2563EB] dark:text-blue-400">.</span>
            </h2>
          </div>
        </div>

        {/* Column 2 & 3: 2 Mentors */}
        {SUPERVISORS.map((mentor) => (
          <div
            key={mentor.name}
            className="mentor-card-wrapper w-full max-w-85 sm:max-w-90 lg:max-w-95"
          >
            <MemberCard member={mentor} />
          </div>
        ))}
      </div>

      {/* ─── Bottom Section: Developers Grid ─── */}
      <div className="mt-20">
        <GroupLabel label="Developers" count={STUDENT_DEVELOPERS.length} />

        <div className="mt-8 grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
          {STUDENT_DEVELOPERS.map((member) => (
            <div
              key={member.name}
              className="dev-card-wrapper w-full max-w-85 sm:max-w-90 lg:max-w-95"
            >
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
