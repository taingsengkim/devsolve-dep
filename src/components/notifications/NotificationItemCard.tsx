"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Flame, HelpCircle, CornerDownRight, Send, Check } from "lucide-react";
import { NotificationItem } from "@/lib/types/notifications/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NotificationItemCardProps {
  item: NotificationItem;
  onMarkRead?: (id: string) => void;
  onReply?: (id: string, message: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const NotificationItemCard: React.FC<NotificationItemCardProps> = ({
  item,
  onMarkRead,
  onReply,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSent, setJustSent] = useState(false);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setIsSubmitting(true);
    if (onReply) {
      onReply(item.id, replyMessage.trim());
    }

    setIsSubmitting(false);
    setJustSent(true);
    setReplyMessage("");
    setTimeout(() => {
      setShowReplyInput(false);
      setJustSent(false);
    }, 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl transition-all ${
        item.isUnread ? "bg-slate-50/80 hover:bg-slate-100/60" : "bg-white hover:bg-slate-50/70"
      }`}
    >
      {/* Active Green Indicator Bar on Left */}
      {item.hasActiveBorder && (
        <span className="w-1.5 self-stretch rounded-full bg-emerald-500 shrink-0 my-0.5" />
      )}

      {/* User Avatar */}
      <Avatar className="w-10 h-10 rounded-full border border-slate-200/80 shrink-0 shadow-2xs">
        {item.actor.avatar && (
          <AvatarImage src={item.actor.avatar} alt={item.actor.name} />
        )}
        <AvatarFallback className="bg-slate-100 text-slate-700 font-semibold text-sm">
          {getInitials(item.actor.name)}
        </AvatarFallback>
      </Avatar>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          {/* Action text line */}
          <div className="text-sm sm:text-base text-slate-700 font-normal leading-snug">
            <span className="font-bold text-slate-900 mr-1.5">
              {item.actor.name}
            </span>
            <span className="text-slate-600 mr-1.5">{item.action}</span>

            {/* Target Title or Target Link */}
            {item.target?.title && (
              item.target.href ? (
                <Link
                  href={item.target.href}
                  className="font-bold text-slate-900 hover:text-blue-600 transition-colors inline-flex items-center"
                >
                  {item.target.title}
                </Link>
              ) : (
                <span className="font-bold text-slate-900">{item.target.title}</span>
              )
            )}

            {/* Target Badge (e.g. Incident, Question) */}
            {item.target?.badge && (
              <Badge
                variant="outline"
                className="ml-2 inline-flex items-center gap-1 py-0.5 px-2 font-medium text-xs rounded-full border-slate-300 bg-slate-50 text-slate-700"
              >
                {item.target.badge.iconType === "incident" && (
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                )}
                {item.target.badge.iconType === "question" && (
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                )}
                <span>{item.target.badge.label}</span>
              </Badge>
            )}
          </div>

          {/* Unread Red Dot Indicator */}
          {item.isUnread && (
            <button
              onClick={() => onMarkRead && onMarkRead(item.id)}
              title="Mark as read"
              className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 mt-1.5 shadow-xs hover:scale-125 transition-transform cursor-pointer"
            />
          )}
        </div>

        {/* Content Snippet / Excerpt */}
        {item.contentSnippet && (
          <p className="text-sm text-slate-600 font-normal mt-1 leading-relaxed break-words">
            {item.contentSnippet}
          </p>
        )}

        {/* Timestamp */}
        <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1.5 flex items-center gap-2">
          <span>{item.timestamp}</span>
        </div>

        {/* Reply Trigger Link */}
        {item.canReply && (
          <div className="mt-2">
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <CornerDownRight className="w-3.5 h-3.5 text-slate-400" />
              <span>Reply</span>
            </button>
          </div>
        )}

        {/* Previous Replies */}
        {item.replies && item.replies.length > 0 && (
          <div className="mt-2.5 space-y-2 border-l-2 border-slate-200 pl-3">
            {item.replies.map((reply) => (
              <div key={reply.id} className="text-xs sm:text-sm">
                <span className="font-semibold text-slate-900">{reply.author}: </span>
                <span className="text-slate-700">{reply.message}</span>
                <span className="text-slate-400 text-xs ml-2">({reply.timestamp})</span>
              </div>
            ))}
          </div>
        )}

        {/* Quick Reply Form */}
        <AnimatePresence>
          {showReplyInput && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSendReply}
              className="mt-3 overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="h-9 text-sm bg-white border-slate-300 rounded-lg focus-visible:ring-blue-500"
                  autoFocus
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || !replyMessage.trim()}
                  className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold cursor-pointer shrink-0"
                >
                  {justSent ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-4 h-4" /> Sent
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Send className="w-3.5 h-3.5" /> Send
                    </span>
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
