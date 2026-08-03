"use client";

import React from "react";

interface SplineRobotProps {
  className?: string;
  splineUrl?: string;
}

export function SplineRobot({
  className = "",
  splineUrl = "https://my.spline.design/genkubgreetingrobot-CBgLI24jLXM7JGSt58ByPdnU/",
}: SplineRobotProps) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <iframe
        src={splineUrl}
        className="w-full h-full border-0"
        title="3D Background Model"
        allow="autoplay; fullscreen; vr"
      />
    </div>
  );
}
