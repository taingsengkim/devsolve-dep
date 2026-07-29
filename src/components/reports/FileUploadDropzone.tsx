"use client";

import React, { useRef } from "react";
import { UploadCloud, File, X, Image as ImageIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface FileUploadDropzoneProps {
  files: AttachedFile[];
  onAddFiles: (newFiles: AttachedFile[]) => void;
  onRemoveFile: (fileId: string) => void;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  files,
  onAddFiles,
  onRemoveFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const rawFiles = Array.from(e.target.files);

    const formattedFiles: AttachedFile[] = rawFiles.map((file) => ({
      id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || "application/octet-stream",
    }));

    onAddFiles(formattedFiles);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    const rawFiles = Array.from(e.dataTransfer.files);

    const formattedFiles: AttachedFile[] = rawFiles.map((file) => ({
      id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || "application/octet-stream",
    }));

    onAddFiles(formattedFiles);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Attachments & Evidence <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <span className="text-xs text-slate-400 font-medium">PNG, JPG, LOG, TXT, PDF (Max 25MB)</span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".png,.jpg,.jpeg,.gif,.txt,.log,.pdf,.json,.xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Dropzone Container */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 group"
      >
        <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Click to upload or drag & drop evidence
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Attach screenshots, HTTP raw request logs, or PoC code files
          </p>
        </div>
      </div>

      {/* Uploaded File List */}
      {files.length > 0 && (
        <div className="space-y-2 mt-3">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Attached Files ({files.length})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  {file.name.match(/\.(png|jpg|jpeg|gif)$/i) ? (
                    <ImageIcon className="w-4 h-4 text-purple-500 shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                  )}
                  <span className="truncate">{file.name}</span>
                  <span className="text-slate-400 shrink-0">({file.size})</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(file.id);
                  }}
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-md shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
