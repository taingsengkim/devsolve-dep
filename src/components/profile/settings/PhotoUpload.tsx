"use client";

import { useId } from "react";
import { Camera, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoUploadProps {
  avatarInitials: string;
  avatarUrl?: string;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
}

export default function PhotoUpload({ avatarInitials, avatarUrl, onUpload, onRemove }: PhotoUploadProps) {
  const inputId = useId();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) onUpload?.(file);
  };

  return (
    <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
      <div className="relative flex-shrink-0">
        <div className="h-16 w-16 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden relative bg-slate-100 dark:bg-slate-800">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-supplied/blob URL, not in next/image's remote host allowlist
            <img src={avatarUrl} alt="Profile Avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-600 text-lg font-bold text-white">
              {avatarInitials}
            </div>
          )}
        </div>
        <label
          htmlFor={inputId}
          className="absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-xs transition hover:bg-blue-700"
        >
          <Camera size={12} />
          <input id={inputId} type="file" accept="image/png,image/jpeg,image/gif" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor={inputId}>
          <Button variant="outline" size="sm" type="button" className="py-1.5 px-3 text-xs cursor-pointer rounded-xl border-slate-300 gap-1.5 pointer-events-none">
            <Upload size={14} />
            Change photo
          </Button>
        </label>
        {onRemove && (
          <Button variant="outline" size="sm" type="button" onClick={onRemove} className="py-1.5 px-3 text-xs text-slate-500 hover:text-red-600 cursor-pointer rounded-xl border-slate-300 gap-1.5">
            <Trash2 size={14} />
            Remove
          </Button>
        )}
        <span className="text-xs text-slate-400">JPG, GIF or PNG. Max size 5MB.</span>
      </div>
    </div>
  );
}
