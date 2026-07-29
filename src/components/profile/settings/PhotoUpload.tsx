"use client";

import { Camera, Trash2, Upload } from "lucide-react";
import { buttonOutline } from "./styles";

interface PhotoUploadProps {
  avatarInitials: string;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
}

export default function PhotoUpload({ avatarInitials, onUpload, onRemove }: PhotoUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload?.(file);
  };

  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2563EB] text-2xl font-bold text-white">
          {avatarInitials}
        </div>
        <label
          htmlFor="avatar-upload"
          className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#2563EB] text-white shadow-[0_0_0_2px_white] transition hover:bg-[#1d4fd1]"
        >
          <Camera size={13} />
          <input id="avatar-upload" type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <label htmlFor="avatar-upload" className={`${buttonOutline} cursor-pointer`}>
            <Upload size={14} />
            Upload new photo
          </label>
          <button type="button" onClick={onRemove} className={buttonOutline}>
            <Trash2 size={14} />
            Remove photo
          </button>
        </div>
        <p className="text-sm text-[#4d4d4d]">Upload a JPG or PNG image. Max size: 5MB.</p>
      </div>
    </div>
  );
}