import React from "react";
import { ProgramDetail } from "@/lib/types/programs/types";
import { Badge } from "@/components/ui/badge";
import { Globe, Shield, AlertTriangle } from "lucide-react";

export function ProgramScopeTab({ program }: { program: ProgramDetail }) {
  const assets = program.assets || [];
  // const inScope = assets.filter((a) => a.isInScope);
  // const outOfScope = assets.filter((a) => !a.isInScope);
  // Strictly handle boolean AND string variants ("true" / "false")
const inScope = assets.filter(
  (a) => a.isInScope === true || (a.isInScope as unknown) === "true"
);

const outOfScope = assets.filter(
  (a) =>
    a.isInScope === false ||
    (a.isInScope as unknown) === "false" ||
    a.isInScope === undefined
);

console.log("TOTAL COUNT:", program.assets?.length)
// this is program scope tab


  return (
    <div className="space-y-6">
      {/* IN-SCOPE ASSETS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <Shield className="w-5 h-5 text-emerald-600" /> */}
            <h3 className="text-2xl font-bold text-slate-800">In-Scope Targets</h3>
          </div>
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 rounded-lg">
            {inScope.length} Targets
          </Badge>
        </div>

        {inScope.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No in-scope assets listed.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {inScope.map((asset) => (
              <div key={asset.id} className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span className="font-mono text-sm font-semibold text-slate-800">
                      {asset.identifier}
                    </span>
                  </div>
                  {asset.description && (
                    <p className="text-xs text-slate-500">{asset.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs rounded-md">
                    {asset.assetType}
                  </Badge>
                  <Badge variant="secondary" className="text-xs rounded-md">
                    Max: {asset.maxSeverity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OUT-OF-SCOPE ASSETS */}
      {outOfScope.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2">
            {/* <AlertTriangle className="w-5 h-5 text-amber-500" /> */}
            <h3 className="text-2xl font-bold text-slate-800">Out-of-Scope Targets</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {outOfScope.map((asset) => (
              <div key={asset.id} className="py-3 flex items-center justify-between">
                <span className="font-mono text-sm text-slate-600">{asset.identifier}</span>
                <Badge variant="outline" className="text-xs rounded-md text-slate-400">
                  {asset.assetType}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}