import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  onPreview: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export default function FormActions({ onCancel, onPreview, onSave, isSaving }: FormActionsProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex flex-col-reverse items-center justify-between gap-3 p-4 sm:flex-row">
      <Button type="button" variant="ghost" onClick={onCancel} className="text-slate-500 hover:text-slate-900 cursor-pointer">
        Cancel
      </Button>
      <div className="flex w-full gap-3 sm:w-auto">
        <Button type="button" variant="outline" onClick={onPreview} className="flex-1 sm:flex-none cursor-pointer rounded-xl border-slate-300 font-semibold text-slate-700">
          Preview profile
        </Button>
        <Button type="button" onClick={onSave} disabled={isSaving} className="flex-1 sm:flex-none cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-2xs">
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}