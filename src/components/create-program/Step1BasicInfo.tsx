"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProgramType, ProgramVisibility } from "./types";

interface Step1BasicInfoProps {
  programName: string;
  handle: string;
  description: string;
  programType: ProgramType;
  visibility: ProgramVisibility;
  policy: string;
  onNameChange: (val: string) => void;
  setHandle: (val: string) => void;
  setDescription: (val: string) => void;
  setProgramType: (val: ProgramType) => void;
  setVisibility: (val: ProgramVisibility) => void;
  setPolicy: (val: string) => void;
  formatHandle: (val: string) => string;
}

export function Step1BasicInfo({
  programName,
  handle,
  description,
  programType,
  visibility,
  onNameChange,
  setHandle,
  setDescription,
  setProgramType,
  setVisibility,
  formatHandle,
}: Step1BasicInfoProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">
        Basic Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Program Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Program Name <span className="text-rose-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="ACME Web Application Security"
            value={programName}
            maxLength={255}
            onChange={(e) => onNameChange(e.target.value)}
            className="h-11 rounded-xl border-border bg-card text-foreground text-base focus-visible:ring-blue-500"
          />
        </div>

        {/* Handle */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Handle <span className="text-rose-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="acme-web-security"
            value={handle}
            maxLength={100}
            onChange={(e) => setHandle(formatHandle(e.target.value))}
            className="h-11 rounded-xl border-border bg-card text-foreground text-base font-mono focus-visible:ring-blue-500"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">
          Description <span className="text-rose-500">*</span>
        </label>
        <Textarea
          rows={4}
          placeholder="Describe what hackers can test and what you're looking for..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-xl border-border bg-card text-foreground text-base focus-visible:ring-blue-500 resize-none p-3.5"
        />
      </div>

      {/* Program Type & Visibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Program Type */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Program Type
          </label>
          <Select
            value={programType}
            onValueChange={(val) => setProgramType(val as ProgramType)}
          >
            <SelectTrigger className="w-full h-11 rounded-xl border-border bg-card text-foreground text-sm font-medium">
              <SelectValue placeholder="Select Program Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BOUNTY">Bounty (Offers Cash Rewards)</SelectItem>
              <SelectItem value="RESPONSE">Response (Points / Reputation Only)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Visibility */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Visibility
          </label>
          <Select
            value={visibility}
            onValueChange={(val) => setVisibility(val as ProgramVisibility)}
          >
            <SelectTrigger className="w-full h-11 rounded-xl border-border bg-card text-foreground text-sm font-medium">
              <SelectValue placeholder="Select Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PUBLIC">Public</SelectItem>
              <SelectItem value="PRIVATE">Private</SelectItem>
              <SelectItem value="INVITE_ONLY">Invite only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

    </div>
  );
}
