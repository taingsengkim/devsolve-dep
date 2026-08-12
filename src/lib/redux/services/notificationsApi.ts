import { baseApi } from "./baseApi";
import {
  NotificationItem,
  NotificationsResponse,
  ReplyNotificationRequest,
  NotificationSettingsPreferences,
  UpdateNotificationSettingsRequest,
  NotificationCategoryKey,
} from "@/lib/types/notifications/types";



export * from "@/lib/types/notifications/types";

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    actor: {
      name: "Santi Cazorla",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    action: "Reply your comment in Knowledgebase",
    target: {
      title: "Adding agent...",
      href: "/dashboard/knowledgebase/adding-agent",
      type: "knowledgebase",
    },
    contentSnippet: "Praesent ultricies lacus in ligula volutpat feugiat.",
    timestamp: "7 March 2023 • 12:12 AM",
    dateGroup: "7 March 2023",
    isUnread: true,
    hasActiveBorder: true,
  },
  {
    id: "notif-2",
    actor: {
      name: "Granit Xhaka",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    action: "Assigned in Number Ticket",
    target: {
      title: "TC-192",
      href: "/dashboard/my-reports?id=TC-192",
      type: "ticket",
    },
    timestamp: "7 March 2023 • 12:12 AM",
    dateGroup: "7 March 2023",
    isUnread: true,
    hasActiveBorder: true,
  },
  {
    id: "notif-3",
    actor: {
      name: "Martin Ødegaard",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    action: "Mention you in comment conversation ticket",
    target: {
      title: "TC-192",
      href: "/dashboard/my-reports?id=TC-192",
      type: "ticket",
    },
    contentSnippet:
      "Yes, I wanted to order the blue iPhone case but accidentally ordered the red one.",
    timestamp: "7 March 2023 • 12:12 AM",
    dateGroup: "7 March 2023",
    isUnread: true,
    hasActiveBorder: true,
    canReply: true,
  },
  {
    id: "notif-4",
    actor: {
      name: "Darlene Robertson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    action: "Change type Ticket to",
    target: {
      title: "",
      href: "/dashboard/my-reports?id=TC-192",
      type: "ticket",
      badge: {
        label: "Incident",
        variant: "outline",
        iconType: "incident",
      },
    },
    timestamp: "6 March 2023 • 12:12 AM",
    dateGroup: "6 March 2023",
    isUnread: false,
    hasActiveBorder: false,
  },
  {
    id: "notif-5",
    actor: {
      name: "Santi Cazorla",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    action: "Reply your comment in Conversation Ticket Details",
    target: {
      title: "TC-192",
      href: "/dashboard/my-reports?id=TC-192",
      type: "ticket",
    },
    contentSnippet: "Sure, the order number is TC-192",
    timestamp: "6 March 2023 • 12:12 AM",
    dateGroup: "6 March 2023",
    isUnread: false,
    hasActiveBorder: false,
    canReply: true,
  },
  {
    id: "notif-6",
    actor: {
      name: "Xavi Hernandez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    },
    action: "Assigned in Number Ticket",
    target: {
      title: "TC-191",
      href: "/dashboard/my-reports?id=TC-191",
      type: "ticket",
    },
    timestamp: "6 March 2023 • 12:12 AM",
    dateGroup: "6 March 2023",
    isUnread: false,
    hasActiveBorder: false,
  },
  {
    id: "notif-7",
    actor: {
      name: "Santi Cazorla",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    action: "Reply your comment in Conversation Ticket Details",
    target: {
      title: "TC-192",
      href: "/dashboard/my-reports?id=TC-192",
      type: "ticket",
    },
    contentSnippet: "Sure, the order number is TC-192",
    timestamp: "6 March 2023 • 12:12 AM",
    dateGroup: "6 March 2023",
    isUnread: false,
    hasActiveBorder: false,
    canReply: true,
  },
  {
    id: "notif-8",
    actor: {
      name: "Guy Hawkins",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    },
    action: "Change type Ticket to",
    target: {
      title: "",
      href: "/dashboard/my-reports?id=TC-170",
      type: "ticket",
      badge: {
        label: "Question",
        variant: "outline",
        iconType: "question",
      },
    },
    timestamp: "6 March 2023 • 12:12 AM",
    dateGroup: "6 March 2023",
    isUnread: false,
    hasActiveBorder: false,
  },
];

let localNotificationsState: NotificationItem[] = [...INITIAL_NOTIFICATIONS];

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettingsPreferences = {
  masterEnabled: true,
  digestFrequency: "DAILY_DIGEST",
  categories: {
    reportStatusChanges: { inApp: true, email: true, push: true },
    retestInvites: { inApp: true, email: true, push: true },
    bountyPayouts: { inApp: true, email: true, push: true },
    newPrograms: { inApp: true, email: true, push: false },
    scopeUpdates: { inApp: true, email: true, push: false },
    privateInvites: { inApp: true, email: true, push: true },
    discussionReplies: { inApp: true, email: true, push: false },
    solutionApprovals: { inApp: true, email: true, push: false },
    followerActivity: { inApp: true, email: false, push: false },
    securityAlerts: { inApp: true, email: true, push: true },
    passwordChanges: { inApp: true, email: true, push: true },
  },
};

let localNotificationSettingsState: NotificationSettingsPreferences = {
  ...DEFAULT_NOTIFICATION_SETTINGS,
};

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, { dateAdded?: string } | void>({
      queryFn: (args) => {
        let filtered = [...localNotificationsState];
        if (args?.dateAdded) {
          filtered = filtered.filter((n) => n.dateGroup === args.dateAdded);
        }
        const unreadCount = filtered.filter((n) => n.isUnread).length;
        return { data: { items: filtered, unreadCount } };
      },
      providesTags: ["Notification"],
    }),

    markAsRead: builder.mutation<NotificationsResponse, string | void>({
      queryFn: (notificationId) => {
        if (notificationId) {
          localNotificationsState = localNotificationsState.map((n) =>
            n.id === notificationId ? { ...n, isUnread: false, hasActiveBorder: false } : n
          );
        } else {
          localNotificationsState = localNotificationsState.map((n) => ({
            ...n,
            isUnread: false,
            hasActiveBorder: false,
          }));
        }
        const unreadCount = localNotificationsState.filter((n) => n.isUnread).length;
        return { data: { items: localNotificationsState, unreadCount } };
      },
      invalidatesTags: ["Notification"],
    }),

    replyNotification: builder.mutation<NotificationItem, ReplyNotificationRequest>({
      queryFn: ({ notificationId, message }) => {
        let updatedItem: NotificationItem | undefined;
        localNotificationsState = localNotificationsState.map((n) => {
          if (n.id === notificationId) {
            const newReply = {
              id: `reply-${Date.now()}`,
              author: "Current User",
              message,
              timestamp: "Just now",
            };
            const updated = {
              ...n,
              replies: [...(n.replies || []), newReply],
            };
            updatedItem = updated;
            return updated;
          }
          return n;
        });

        if (!updatedItem) {
          return { error: { status: 404, data: "Notification not found" } };
        }
        return { data: updatedItem };
      },
      invalidatesTags: ["Notification"],
    }),

    getNotificationSettings: builder.query<NotificationSettingsPreferences, void>({
      queryFn: () => {
        return { data: localNotificationSettingsState };
      },
      providesTags: ["Notification"],
    }),

    updateNotificationSettings: builder.mutation<
      NotificationSettingsPreferences,
      UpdateNotificationSettingsRequest
    >({
      queryFn: (updates) => {
        localNotificationSettingsState = {
          ...localNotificationSettingsState,
          ...updates,
          categories: {
            ...localNotificationSettingsState.categories,
            ...(updates.categories
              ? Object.entries(updates.categories).reduce((acc, [catKey, channels]) => {
                  const key = catKey as NotificationCategoryKey;
                  return {
                    ...acc,
                    [key]: {
                      ...(localNotificationSettingsState.categories[key] || {
                        inApp: true,
                        email: true,
                        push: false,
                      }),
                      ...channels,
                    },
                  };
                }, {})
              : {}),
          },
        };
        return { data: localNotificationSettingsState };
      },
      invalidatesTags: ["Notification"],
    }),

  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useReplyNotificationMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} = notificationsApi;

