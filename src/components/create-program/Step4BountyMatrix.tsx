"use client";

import React from "react";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ProgramType } from "./types";

interface BountyMatrixState {
  critical: { min: string; max: string };
  high: { min: string; max: string };
  medium: { min: string; max: string };
  low: { min: string; max: string };
}

interface Step4BountyMatrixProps {
  programType: ProgramType;
  offerBounties: boolean;
  setOfferBounties: (val: boolean) => void;
  bountyMatrix: BountyMatrixState;
  setBountyMatrix: React.Dispatch<React.SetStateAction<BountyMatrixState>>;
  pointsMatrix: BountyMatrixState;
  setPointsMatrix: React.Dispatch<React.SetStateAction<BountyMatrixState>>;
}

export function Step4BountyMatrix({
  programType,
  offerBounties,
  setOfferBounties,
  bountyMatrix,
  setBountyMatrix,
  pointsMatrix,
  setPointsMatrix,
}: Step4BountyMatrixProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
        {programType === "BOUNTY" ? "Bounty Matrix" : "Response Matrix"}
      </h2>

      {/* Checkbox Offer Financial Bounties */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
        <input
          type="checkbox"
          id="offerBounties"
          checked={offerBounties}
          onChange={(e) => setOfferBounties(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
        />
        <label
          htmlFor="offerBounties"
          className="text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
        >
          {programType === "BOUNTY"
            ? "Offer financial bounties (Bounty Program)"
            : "Offer reputation points (Response Program)"}
        </label>
      </div>

      {/* REWARD MATRIX TABLE (DYNAMIC $ vs pts) */}
      {offerBounties && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                <th className="py-3.5 px-6">Severity</th>
                <th className="py-3.5 px-4">
                  Min ({programType === "BOUNTY" ? "$" : "pts"})
                </th>
                <th className="py-3.5 px-6">
                  Max ({programType === "BOUNTY" ? "$" : "pts"})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* CRITICAL */}
              <tr>
                <td className="py-4 px-6">
                  <span className="inline-block px-3 py-1 text-xs font-bold rounded-md bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900/50">
                    CRITICAL
                  </span>
                </td>
                <td className="py-4 px-4">
                  <Input
                    type="number"
                    value={
                      programType === "BOUNTY"
                        ? bountyMatrix.critical.min
                        : pointsMatrix.critical.min
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (programType === "BOUNTY") {
                        setBountyMatrix({
                          ...bountyMatrix,
                          critical: { ...bountyMatrix.critical, min: val },
                        });
                      } else {
                        setPointsMatrix({
                          ...pointsMatrix,
                          critical: { ...pointsMatrix.critical, min: val },
                        });
                      }
                    }}
                    className="h-10 w-32 rounded-xl text-base font-semibold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </td>
                <td className="py-4 px-6">
                  <Input
                    type="number"
                    value={
                      programType === "BOUNTY"
                        ? bountyMatrix.critical.max
                        : pointsMatrix.critical.max
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (programType === "BOUNTY") {
                        setBountyMatrix({
                          ...bountyMatrix,
                          critical: { ...bountyMatrix.critical, max: val },
                        });
                      } else {
                        setPointsMatrix({
                          ...pointsMatrix,
                          critical: { ...pointsMatrix.critical, max: val },
                        });
                      }
                    }}
                    className="h-10 w-32 rounded-xl text-base font-semibold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </td>
              </tr>

              {/* HIGH */}
              <tr>
                <td className="py-4 px-6">
                  <span className="inline-block px-3 py-1 text-xs font-bold rounded-md bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/50">
                    HIGH
                  </span>
                </td>
                <td className="py-4 px-4">
                  <Input
                    type="number"
                    value={
                      programType === "BOUNTY"
                        ? bountyMatrix.high.min
                        : pointsMatrix.high.min
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (programType === "BOUNTY") {
                        setBountyMatrix({
                          ...bountyMatrix,
                          high: { ...bountyMatrix.high, min: val },
                        });
                      } else {
                        setPointsMatrix({
                          ...pointsMatrix,
                          high: { ...pointsMatrix.high, min: val },
                        });
                      }
                    }}
                    className="h-10 w-32 rounded-xl text-base font-semibold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </td>
                <td className="py-4 px-6">
                  <Input
                    type="number"
                    value={
                      programType === "BOUNTY"
                        ? bountyMatrix.high.max
                        : pointsMatrix.high.max
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (programType === "BOUNTY") {
                        setBountyMatrix({
                          ...bountyMatrix,
                          high: { ...bountyMatrix.high, max: val },
                        });
                      } else {
                        setPointsMatrix({
                          ...pointsMatrix,
                          high: { ...pointsMatrix.high, max: val },
                        });
                      }
                    }}
                    className="h-10 w-32 rounded-xl text-base font-semibold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </td>
              </tr>

              {/* MEDIUM */}
              <tr>
                <td className="py-4 px-6">
                  <span className="inline-block px-3 py-1 text-xs font-bold rounded-md bg-sky-50 text-sky-600 border border-sky-200 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-900/50">
                    MEDIUM
                  </span>
                </td>
                <td className="py-4 px-4">
                  <Input
                    type="number"
                    value={
                      programType === "BOUNTY"
                        ? bountyMatrix.medium.min
                        : pointsMatrix.medium.min
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (programType === "BOUNTY") {
                        setBountyMatrix({
                          ...bountyMatrix,
                          medium: { ...bountyMatrix.medium, min: val },
                        });
                      } else {
                        setPointsMatrix({
                          ...pointsMatrix,
                          medium: { ...pointsMatrix.medium, min: val },
                        });
                      }
                    }}
                    className="h-10 w-32 rounded-xl text-base font-semibold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </td>
                <td className="py-4 px-6">
                  <Input
                    type="number"
                    value={
                      programType === "BOUNTY"
                        ? bountyMatrix.medium.max
                        : pointsMatrix.medium.max
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (programType === "BOUNTY") {
                        setBountyMatrix({
                          ...bountyMatrix,
                          medium: { ...bountyMatrix.medium, max: val },
                        });
                      } else {
                        setPointsMatrix({
                          ...pointsMatrix,
                          medium: { ...pointsMatrix.medium, max: val },
                        });
                      }
                    }}
                    className="h-10 w-32 rounded-xl text-base font-semibold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </td>
              </tr>

              {/* LOW */}
              <tr>
                <td className="py-4 px-6">
                  <span className="inline-block px-3 py-1 text-xs font-bold rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/50">
                    LOW
                  </span>
                </td>
                <td className="py-4 px-4">
                  <Input
                    type="number"
                    value={
                      programType === "BOUNTY"
                        ? bountyMatrix.low.min
                        : pointsMatrix.low.min
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (programType === "BOUNTY") {
                        setBountyMatrix({
                          ...bountyMatrix,
                          low: { ...bountyMatrix.low, min: val },
                        });
                      } else {
                        setPointsMatrix({
                          ...pointsMatrix,
                          low: { ...pointsMatrix.low, min: val },
                        });
                      }
                    }}
                    className="h-10 w-32 rounded-xl text-base font-semibold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </td>
                <td className="py-4 px-6">
                  <Input
                    type="number"
                    value={
                      programType === "BOUNTY"
                        ? bountyMatrix.low.max
                        : pointsMatrix.low.max
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (programType === "BOUNTY") {
                        setBountyMatrix({
                          ...bountyMatrix,
                          low: { ...bountyMatrix.low, max: val },
                        });
                      } else {
                        setPointsMatrix({
                          ...pointsMatrix,
                          low: { ...pointsMatrix.low, max: val },
                        });
                      }
                    }}
                    className="h-10 w-32 rounded-xl text-base font-semibold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* INFO BOX */}
      <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl flex items-start gap-3 text-blue-900 dark:text-blue-200">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm font-medium leading-relaxed">
          {programType === "BOUNTY"
            ? "Financial rewards are displayed on resolved reports and agreed on-platform. Actual payment transfers occur off-platform via email or direct communication."
            : "Points are rewarded upon valid vulnerability resolution and count towards researcher platform rankings."}
        </p>
      </div>
    </div>
  );
}
