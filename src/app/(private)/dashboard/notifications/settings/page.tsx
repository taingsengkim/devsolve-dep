"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Bell,
  Building2,
  Check,
  ChevronRight,
  FileText,
  Lock,
  Mail,
  MessageSquare,
  RefreshCw,
  Save,
  Shield,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Toggle from "@/components/profile/settings/Toggle";
import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "@/lib/redux/services/notificationsApi";
import {
  NotificationCategoryKey,
  NotificationChannel,
  NotificationFrequency,
  NotificationSettingsPreferences,
} from "@/lib/types/notifications/types";

interface CategoryDefinition {
  key: NotificationCategoryKey;
  label: string;
  description: string;
  channels: NotificationChannel[];
}

interface SectionDefinition {
  id: "security" | "reports" | "programs" | "community";
  title: string;
  description: string;
  icon: typeof Lock;
  items: CategoryDefinition[];
}

const NOTIFICATION_SECTIONS: SectionDefinition[] = [
  {
    id: "security",
    title: "Security & Account",
    description: "Alerts for login security, password changes, and two-factor authentication.",
    icon: Lock,
    items: [
      {
        key: "securityAlerts",
        label: "Login Alerts & New Devices",
        description: "Receive immediate notifications when your account is logged in from a new IP or device.",
        channels: ["inApp", "email", "push"],
      },
      {
        key: "passwordChanges",
        label: "Password & 2FA Modifications",
        description: "Notifications when password, 2FA, or security settings are changed.",
        channels: ["inApp", "email", "push"],
      },
    ],
  },
  {
    id: "reports",
    title: "Vulnerability Reports & Retests",
    description: "Updates regarding submitted reports, triage changes, retest invites, and bounties.",
    icon: FileText,
    items: [
      {
        key: "reportStatusChanges",
        label: "Report Status Changes",
        description: "Notifications when a report moves to Triaged, Validated, Resolved, or Closed.",
        channels: ["inApp", "email", "push"],
      },
      {
        key: "retestInvites",
        label: "Retest Invitations & Reminders",
        description: "Invites to retest patch fixes for previously resolved vulnerabilities.",
        channels: ["inApp", "email", "push"],
      },
      {
        key: "bountyPayouts",
        label: "Bounty Payouts & Receipts",
        description: "Instant notifications when a reward or bounty payment is processed.",
        channels: ["inApp", "email", "push"],
      },
    ],
  },
  {
    id: "programs",
    title: "Programs & Targets",
    description: "Stay up-to-date on new bug bounty programs, scope modifications, and private invites.",
    icon: Building2,
    items: [
      {
        key: "newPrograms",
        label: "New Program Launches",
        description: "Alerts when companies launch public or bounty-eligible programs.",
        channels: ["inApp", "email"],
      },
      {
        key: "scopeUpdates",
        label: "Target Scope Updates",
        description: "Notifications when assets, domains, or rules of engagement change.",
        channels: ["inApp", "email"],
      },
      {
        key: "privateInvites",
        label: "Exclusive & Private Program Invites",
        description: "Direct invitations to participate in confidential or invite-only programs.",
        channels: ["inApp", "email", "push"],
      },
    ],
  },
  {
    id: "community",
    title: "Community & Discussions",
    description: "Activity in discussions, comments, solution answers, and follower updates.",
    icon: MessageSquare,
    items: [
      {
        key: "discussionReplies",
        label: "Replies & Mentions",
        description: "When someone replies to your post or mentions @username in a comment.",
        channels: ["inApp", "email"],
      },
      {
        key: "solutionApprovals",
        label: "Solution Approvals & Votes",
        description: "Updates when your submitted solution is upvoted or accepted.",
        channels: ["inApp", "email"],
      },
      {
        key: "followerActivity",
        label: "Follower Activity & Achievements",
        description: "Notifications when someone follows your profile or unlocks new badges.",
        channels: ["inApp", "email"],
      },
    ],
  },
];

export default function NotificationSettingsPage() {
  const { data: serverSettings, isLoading } = useGetNotificationSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] =
    useUpdateNotificationSettingsMutation();

  const [formState, setFormState] = useState<NotificationSettingsPreferences | null>(
    null
  );
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (serverSettings) {
      setFormState(serverSettings);
      setIsDirty(false);
    }
  }, [serverSettings]);

  const handleToggleChannel = (
    key: NotificationCategoryKey,
    channel: NotificationChannel,
    value: boolean
  ) => {
    if (!formState) return;
    setFormState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: {
          ...prev.categories,
          [key]: {
            ...prev.categories[key],
            [channel]: value,
          },
        },
      };
    });
    setIsDirty(true);
  };

  const handleMasterToggle = (checked: boolean) => {
    if (!formState) return;
    setFormState((prev) => (prev ? { ...prev, masterEnabled: checked } : prev));
    setIsDirty(true);
  };

  const handleFrequencyChange = (value: NotificationFrequency) => {
    if (!formState) return;
    setFormState((prev) => (prev ? { ...prev, digestFrequency: value } : prev));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!formState) return;
    try {
      await updateSettings(formState).unwrap();
      setIsDirty(false);
      toast.success("Notification settings saved successfully.");
    } catch {
      toast.error("Failed to save notification settings. Please try again.");
    }
  };

  const handleReset = () => {
    if (serverSettings) {
      setFormState(serverSettings);
      setIsDirty(false);
      toast.info("Reset settings to last saved configuration.");
    }
  };

  if (isLoading || !formState) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full space-y-6 pb-12"
      >
        <header className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-2 sm:flex-row sm:items-center dark:border-slate-800">
          <div className="space-y-2">
            <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-8 w-64 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
        </header>

        <div className="space-y-6 animate-pulse">
          <div className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full space-y-6 pb-12"
    >
      {/* Header */}
      <header className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-2 sm:flex-row sm:items-center dark:border-slate-800">
        <div className="space-y-1">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500"
          >
            <Link
              href="/dashboard/profile"
              className="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
            >
              Profile
            </Link>
            <ChevronRight className="size-3.5 text-slate-300 dark:text-slate-700" />
            <Link
              href="/dashboard/profile/settings"
              className="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
            >
              Settings
            </Link>
            <ChevronRight className="size-3.5 text-slate-300 dark:text-slate-700" />
            <span className="text-slate-900 dark:text-slate-200">
              Notification Settings
            </span>
          </nav>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
            Notification Settings
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400">
            Configure how and when you receive notifications across email, in-app,
            and push channels.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {isDirty && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
              className="h-10 cursor-pointer rounded-xl border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <RefreshCw className="mr-2 size-4" />
              Reset
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="h-10 cursor-pointer rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-2xs hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="mr-2 size-4 animate-spin" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            Save Changes
          </Button>
        </div>
      </header>

      {/* Overview & Global Controls Card */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800/80">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Bell className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Master Notification Control
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Turn on or pause all incoming system and email notifications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {formState.masterEnabled ? "Notifications Active" : "Notifications Muted"}
            </span>
            <Toggle
              checked={formState.masterEnabled}
              onChange={handleMasterToggle}
              label="Toggle master notifications"
            />
          </div>
        </div>

        {/* Digest Frequency Picker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Mail className="size-4 text-slate-500" />
              Email Digest Frequency
            </label>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Choose how often email summaries of activity are dispatched.
            </p>
          </div>

          <div>
            <Select
              value={formState.digestFrequency}
              onValueChange={(val) =>
                handleFrequencyChange(val as NotificationFrequency)
              }
              disabled={!formState.masterEnabled}
            >
              <SelectTrigger className="w-full h-11 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 rounded-xl text-base text-slate-900 dark:text-slate-100">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IMMEDIATE">
                  Send Immediately (Real-time)
                </SelectItem>
                <SelectItem value="DAILY_DIGEST">
                  Daily Summary (Once per day)
                </SelectItem>
                <SelectItem value="WEEKLY_SUMMARY">
                  Weekly Summary (Every Monday)
                </SelectItem>
                <SelectItem value="OFF">Turn Off Digest Emails</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Category Preference Sections */}
      <div className="space-y-6">
        {NOTIFICATION_SECTIONS.map((section) => {
          const SectionIcon = section.icon;

          return (
            <section
              key={section.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800/80">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <SectionIcon className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {section.title}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {section.description}
                  </p>
                </div>
              </div>

              {/* Channel Header Legend */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 pb-2">
                <div className="sm:col-span-6">Notification Event</div>
                <div className="sm:col-span-2 text-center flex items-center justify-center gap-1">
                  <Bell className="size-3.5" /> In-App
                </div>
                <div className="sm:col-span-2 text-center flex items-center justify-center gap-1">
                  <Mail className="size-3.5" /> Email
                </div>
                <div className="sm:col-span-2 text-center flex items-center justify-center gap-1">
                  <Smartphone className="size-3.5" /> Push
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {section.items.map((item) => {
                  const prefs = formState.categories[item.key] || {
                    inApp: true,
                    email: true,
                    push: false,
                  };

                  return (
                    <div
                      key={item.key}
                      className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                    >
                      <div className="sm:col-span-6 space-y-0.5">
                        <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                          {item.label}
                        </span>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>

                      {/* In-App Toggle */}
                      <div className="sm:col-span-2 flex sm:justify-center items-center justify-between gap-2">
                        <span className="sm:hidden text-xs font-semibold text-slate-500">
                          In-App:
                        </span>
                        <Toggle
                          checked={formState.masterEnabled && prefs.inApp}
                          onChange={(val) =>
                            handleToggleChannel(item.key, "inApp", val)
                          }
                          label={`${item.label} In-App`}
                        />
                      </div>

                      {/* Email Toggle */}
                      <div className="sm:col-span-2 flex sm:justify-center items-center justify-between gap-2">
                        <span className="sm:hidden text-xs font-semibold text-slate-500">
                          Email:
                        </span>
                        <Toggle
                          checked={formState.masterEnabled && prefs.email}
                          onChange={(val) =>
                            handleToggleChannel(item.key, "email", val)
                          }
                          label={`${item.label} Email`}
                        />
                      </div>

                      {/* Push Toggle */}
                      <div className="sm:col-span-2 flex sm:justify-center items-center justify-between gap-2">
                        <span className="sm:hidden text-xs font-semibold text-slate-500">
                          Push:
                        </span>
                        {item.channels.includes("push") ? (
                          <Toggle
                            checked={formState.masterEnabled && prefs.push}
                            onChange={(val) =>
                              handleToggleChannel(item.key, "push", val)
                            }
                            label={`${item.label} Push`}
                          />
                        ) : (
                          <span className="text-xs text-slate-400 italic">N/A</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Sticky Bottom Save Bar for Mobile / Long Scrolling */}
      {isDirty && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50/95 p-4 shadow-lg backdrop-blur-md dark:border-blue-900/60 dark:bg-slate-900/95"
        >
          <div className="flex items-center gap-2.5 text-sm font-semibold text-blue-900 dark:text-blue-200">
            <Shield className="size-5 text-blue-600 dark:text-blue-400" />
            <span>You have unsaved notification setting changes</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isSaving}
              className="rounded-xl border-slate-300 dark:border-slate-700 cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              {isSaving ? (
                <RefreshCw className="mr-1.5 size-4 animate-spin" />
              ) : (
                <Check className="mr-1.5 size-4" />
              )}
              Save
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
