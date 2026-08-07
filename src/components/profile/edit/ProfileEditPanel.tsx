"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { toast } from "sonner";
import { AlertCircle, Camera, Check, Loader2, Lock, Trash2, X } from "lucide-react";
import { parseApiError, type ParsedApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useGetEditProfileFormQuery,
  useUpdateProfileMutation,
} from "@/lib/redux/services/profileApi";
import {
  useUploadAvatarMutation,
  useRemoveAvatarMutation,
} from "@/lib/redux/services/avatarApi";
import {
  AVATAR_ACCEPT_ATTR,
  validateAvatarFile,
} from "@/lib/validations/avatar";
import type {
  EditProfileFormData,
  SocialLinksForm,
} from "@/lib/types/profile/types";

const MAX_BIO = 500;

const SOCIAL_FIELDS: { key: keyof SocialLinksForm; label: string; placeholder: string }[] = [
  { key: "github", label: "GitHub", placeholder: "https://github.com/username" },
  { key: "twitter", label: "X (Twitter)", placeholder: "https://x.com/username" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  { key: "website", label: "Website", placeholder: "https://yoursite.dev" },
];

const GENDER_OPTIONS: { value: NonNullable<EditProfileFormData["gender"]>; label: string }[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const inputClass =
  "h-11 rounded-xl border-slate-300 bg-white text-base text-slate-900 shadow-2xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";

const errorInputClass =
  "border-rose-400 focus-visible:ring-rose-500/30 dark:border-rose-700";

/**
 * The PATCH body uses the backend's field names, the form uses its own, so a
 * server-side complaint about `biography` has to find its way to the Bio box.
 * `fullName` is split into firstName/lastName on the way out, which is why two
 * API fields land on one control.
 */
const API_FIELD_TO_FORM: Record<string, string> = {
  firstName: "fullName",
  lastName: "fullName",
  biography: "bio",
  country: "location",
  phone: "phone",
  avatarUrl: "avatarUrl",
  dateOfBirth: "dateOfBirth",
  gender: "gender",
  socialLinks: "socialLinks",
};

/* One card and one field primitive for the whole form — every label, gap and
   input matches by construction instead of by each section re-deciding. */

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-5">
        <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  htmlFor,
  error,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      {children}
      {/* The server's own words, under the control it rejected. */}
      {error ? (
        <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
          {error}
        </p>
      ) : (
        hint && (
          <p className="text-sm text-slate-400 dark:text-slate-500">{hint}</p>
        )
      )}
    </div>
  );
}

interface ProfileEditPanelProps {
  /** Called on save or cancel so the page can return to the read view. */
  onDone: () => void;
}

export default function ProfileEditPanel({ onDone }: ProfileEditPanelProps) {
  const { data: initialData, isLoading } = useGetEditProfileFormQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
  const [removeAvatar, { isLoading: isRemoving }] = useRemoveAvatarMutation();

  const [form, setForm] = useState<EditProfileFormData | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<ParsedApiError | null>(null);
  const isAvatarBusy = isUploading || isRemoving;

  /** The server's message for a given form control, if it sent one. */
  const fieldError = (formKey: string): string | undefined => {
    if (!saveError) return undefined;
    for (const [apiField, message] of Object.entries(saveError.fieldErrors)) {
      if (API_FIELD_TO_FORM[apiField] === formKey) return message;
      if (apiField === formKey) return message;
    }
    return undefined;
  };

  // Seeded from the query the first time it resolves, then owned locally so
  // typing is never fighting a refetch.
  const values = form ?? initialData ?? null;

  const patch = (next: Partial<EditProfileFormData>) =>
    setForm((prev) => ({ ...(prev ?? initialData!), ...next }));

  if (isLoading || !values) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-56 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  const handleAvatarPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const reason = validateAvatarFile(file);
    if (reason) {
      setAvatarError(reason);
      return;
    }

    setAvatarError(null);
    try {
      const profile = await uploadAvatar(file).unwrap();
      patch({ avatarUrl: profile.avatarUrl || undefined });
      toast.success("Photo updated.");
    } catch (error) {
      setAvatarError(parseApiError(error, "Upload failed.").message);
    }
  };

  const handleAvatarRemove = async () => {
    setAvatarError(null);
    try {
      await removeAvatar().unwrap();
      patch({ avatarUrl: undefined });
      toast.success("Photo removed.");
    } catch (error) {
      setAvatarError(
        parseApiError(error, "Could not remove your photo.").message,
      );
    }
  };

  const handleSave = async () => {
    setSaveError(null);

    try {
      await updateProfile(values).unwrap();
      toast.success("Profile updated.");
      onDone();
    } catch (error) {
      // Keep the reason on screen next to the fields it concerns, rather than
      // in a toast that vanishes before it can be acted on.
      const parsed = parseApiError(error, "Failed to update profile.");
      setSaveError(parsed);
      toast.error(parsed.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mx-auto w-full max-w-3xl space-y-5"
    >
      {saveError && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="flex gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/60 dark:bg-rose-950/40"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-bold text-rose-800 dark:text-rose-200">
              {saveError.status
                ? `Couldn't save (${saveError.status})`
                : "Couldn't save"}
            </p>
            <p className="text-sm text-rose-700 dark:text-rose-300">
              {saveError.message}
            </p>

            {/* Anything the server named a field for is repeated under that
                field too; listing them here means you can see the whole set
                without hunting down the page. */}
            {Object.keys(saveError.fieldErrors).length > 0 && (
              <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm text-rose-700 dark:text-rose-300">
                {Object.entries(saveError.fieldErrors).map(([field, message]) => (
                  <li key={field}>
                    <span className="font-semibold">{field}</span>: {message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}

      <Card
        title="Photo"
        description="Shown on your profile and next to everything you post."
      >
        <div className="flex flex-wrap items-center gap-5">
          <div className="relative shrink-0">
            <div className="relative size-24 overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              {values.avatarUrl ? (
                <Image
                  src={values.avatarUrl}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-blue-600 text-2xl font-bold text-white">
                  {values.avatarInitials}
                </div>
              )}

              {isAvatarBusy && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs">
                  <Loader2 className="size-5 animate-spin text-white" />
                </div>
              )}
            </div>

            <label
              htmlFor="profile-avatar-upload"
              title="Upload a photo"
              className={`absolute -bottom-0.5 -right-0.5 flex size-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md ring-2 ring-white transition dark:ring-slate-900 ${
                isAvatarBusy
                  ? "pointer-events-none opacity-60"
                  : "cursor-pointer hover:bg-blue-700"
              }`}
            >
              <Camera size={14} />
              <input
                id="profile-avatar-upload"
                type="file"
                accept={AVATAR_ACCEPT_ATTR}
                disabled={isAvatarBusy}
                className="hidden"
                onChange={handleAvatarPick}
              />
            </label>
          </div>

          <div className="min-w-0 space-y-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              PNG, JPG or WebP · up to 2MB.
              <br />
              Saves as soon as you pick one.
            </p>

            {values.avatarUrl && (
              <button
                type="button"
                onClick={handleAvatarRemove}
                disabled={isAvatarBusy}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-rose-950/40"
              >
                <Trash2 size={14} />
                Remove photo
              </button>
            )}

            {avatarError && (
              <p className="text-sm font-medium text-rose-600">{avatarError}</p>
            )}
          </div>
        </div>
      </Card>

      <Card title="About you">
        <div className="space-y-5">
          <Field
            label="Full name"
            htmlFor="edit-full-name"
            error={fieldError("fullName")}
          >
            <Input
              id="edit-full-name"
              value={values.fullName}
              onChange={(e) => patch({ fullName: e.target.value })}
              placeholder="First & last name"
              className={cn(inputClass, fieldError("fullName") && errorInputClass)}
            />
          </Field>

          <Field
            label="Bio"
            htmlFor="edit-bio"
            error={fieldError("bio")}
            hint={
              <span className="flex justify-between">
                <span>A short introduction for your profile.</span>
                <span className="tabular-nums">
                  {values.bio.length}/{MAX_BIO}
                </span>
              </span>
            }
          >
            <textarea
              id="edit-bio"
              value={values.bio}
              maxLength={MAX_BIO}
              rows={4}
              onChange={(e) => patch({ bio: e.target.value })}
              placeholder="Tell the community about your skills and interests…"
              className="w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-base text-slate-900 shadow-2xs outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </Field>

          <Field
            label="Location"
            htmlFor="edit-location"
            error={fieldError("location")}
          >
            <Input
              id="edit-location"
              value={values.location}
              onChange={(e) => patch({ location: e.target.value })}
              placeholder="City, Country"
              className={cn(inputClass, fieldError("location") && errorInputClass)}
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Social links"
        description="Paste the full URL to each profile."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SOCIAL_FIELDS.map((field) => (
            <Field
              key={field.key}
              label={field.label}
              htmlFor={`edit-${field.key}`}
              error={fieldError("socialLinks") ?? fieldError(field.key)}
            >
              <Input
                id={`edit-${field.key}`}
                inputMode="url"
                value={values.socialLinks[field.key]}
                onChange={(e) =>
                  patch({
                    socialLinks: {
                      ...values.socialLinks,
                      [field.key]: e.target.value,
                    },
                  })
                }
                placeholder={field.placeholder}
                className={inputClass}
              />
            </Field>
          ))}
        </div>
      </Card>

      <Card title="Personal details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Phone"
            htmlFor="edit-phone"
            error={fieldError("phone")}
          >
            <Input
              id="edit-phone"
              type="tel"
              value={values.phone ?? ""}
              onChange={(e) => patch({ phone: e.target.value })}
              placeholder="+1 555 123 4567"
              className={cn(inputClass, fieldError("phone") && errorInputClass)}
            />
          </Field>

          <Field
            label="Date of birth"
            htmlFor="edit-dob"
            error={fieldError("dateOfBirth")}
          >
            <Input
              id="edit-dob"
              type="date"
              value={values.dateOfBirth ?? ""}
              onChange={(e) => patch({ dateOfBirth: e.target.value })}
              className={cn(
                inputClass,
                fieldError("dateOfBirth") && errorInputClass,
              )}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Gender" error={fieldError("gender")}>
              <div className="flex flex-wrap gap-2">
                {GENDER_OPTIONS.map((option) => {
                  const active = values.gender === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => patch({ gender: option.value })}
                      className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                        active
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>
        </div>
      </Card>

      {/* Username and email are shown because people look for them here, but
          neither is writable: they come from Keycloak and the profile PATCH
          has no field for either. An input that silently discards what you
          type is worse than no input. */}
      <Card title="Account">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Username"
            hint={
              <span className="inline-flex items-center gap-1">
                <Lock size={12} /> Managed by your account
              </span>
            }
          >
            <Input
              value={values.username}
              disabled
              readOnly
              className={`${inputClass} cursor-not-allowed opacity-70`}
            />
          </Field>

          <Field
            label="Email"
            hint={
              <span className="inline-flex items-center gap-1">
                <Lock size={12} /> Managed by your account
              </span>
            }
          >
            <Input
              value={values.email}
              disabled
              readOnly
              className={`${inputClass} cursor-not-allowed opacity-70`}
            />
          </Field>
        </div>
      </Card>

      {/* Actions follow the form down the page — no scrolling back up to save. */}
      <div className="sticky bottom-0 z-10 flex items-center justify-end gap-2 rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <Button
          type="button"
          variant="outline"
          onClick={onDone}
          className="h-11 rounded-xl border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <X size={15} />
          Cancel
        </Button>

        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"
        >
          {isSaving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Check size={15} />
          )}
          Save changes
        </Button>
      </div>
    </motion.div>
  );
}
