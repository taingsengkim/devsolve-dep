import * as z from "zod";
import { isCleanText, profanityMessage } from "@/lib/moderation/profanity";
import { isReadableText, readabilityMessage } from "@/lib/moderation/readability";

export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, "Organization name must be at least 2 characters")
    .max(100)
    .refine(isCleanText, profanityMessage("Organization name"))
    .refine(isReadableText, readabilityMessage("Organization name"))
    .optional(),
  domain: z.string().optional(),
  websiteUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  logoUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  description: z
    .string()
    .refine(isCleanText, profanityMessage("Description"))
    .refine(isReadableText, readabilityMessage("Description"))
    .optional(),
  industry: z
    .enum([
      "TECHNOLOGY",
      "FINANCE",
      "HEALTHCARE",
      "ECOMMERCE",
      "GOVERNMENT",
      "EDUCATION",
      "OTHER",
    ])
    .optional(),
  companySize: z.string().optional(),
  country: z.string().optional(),
});

export type UpdateOrganizationFormValues = z.infer<typeof updateOrganizationSchema>;

export const inviteOrganizationMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["MANAGER", "MEMBER", "VIEWER"]),
  permissions: z.array(z.string()).default([]),
});

export type InviteOrganizationMemberFormValues = z.infer<typeof inviteOrganizationMemberSchema>;

export const updateMemberRoleSchema = z.object({
  role: z.enum(["MANAGER", "MEMBER", "VIEWER"]),
});

export type UpdateMemberRoleFormValues = z.infer<typeof updateMemberRoleSchema>;

export const updateMemberPermissionsSchema = z.object({
  permissions: z.array(z.string()),
});

export type UpdateMemberPermissionsFormValues = z.infer<typeof updateMemberPermissionsSchema>;
