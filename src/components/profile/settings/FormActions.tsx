import { card, buttonGhost, buttonOutline, buttonPrimary } from "./styles";

interface FormActionsProps {
  onCancel: () => void;
  onPreview: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export default function FormActions({ onCancel, onPreview, onSave, isSaving }: FormActionsProps) {
  return (
    <div className={`${card} flex flex-col-reverse items-center justify-between gap-3 p-4 sm:flex-row`}>
      <button type="button" onClick={onCancel} className={buttonGhost}>
        Cancel
      </button>
      <div className="flex w-full gap-3 sm:w-auto">
        <button type="button" onClick={onPreview} className={`${buttonOutline} flex-1 sm:flex-none`}>
          Preview profile
        </button>
        <button type="button" onClick={onSave} disabled={isSaving} className={`${buttonPrimary} flex-1 sm:flex-none`}>
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}