"use client";

import Image from "next/image";
import { Camera, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoUploadProps {
  avatarInitials: string;
  avatarUrl?: string;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
}

export default function PhotoUpload({ avatarUrl = "/justin.png", onUpload, onRemove }: PhotoUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload?.(file);
  };

  return (
    <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
      <div className="relative flex-shrink-0">
        <div className="h-16 w-16 rounded-full border border-slate-200 shadow-2xs overflow-hidden relative bg-slate-100">
          <Image
            src={avatarUrl}
            alt="Profile Avatar"
            fill
            className="object-cover"
          />
        </div>
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-xs transition hover:bg-blue-700"
        >
          <Camera size={12} />
          <input id="avatar-upload" type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="avatar-upload">
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