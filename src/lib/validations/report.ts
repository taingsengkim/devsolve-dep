import * as z from "zod";

export const VULNERABILITY_CATEGORIES = [
  "SQL Injection (SQLi)",
  "Remote Code Execution (RCE)",
  "Cross-Site Scripting (XSS - Stored)",
  "Cross-Site Scripting (XSS - Reflected)",
  "Server-Side Request Forgery (SSRF)",
  "Insecure Direct Object Reference (IDOR)",
  "Authentication Bypass / Broken Auth",
  "Privilege Escalation",
  "CSRF / Cross-Site Request Forgery",
  "Business Logic Flaw",
  "Information Disclosure / Sensitive Data Leak",
  "Broken Access Control",
  "Cryptographic Flaw",
  "Other Security Issue",
] as const;

export const submitReportSchema = z.object({
  programId: z.string().min(1, "Please select a target program."),
  targetAsset: z.string().min(2, "Target asset/URL is required."),
  category: z.string().min(1, "Please select a vulnerability category."),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]),
  title: z
    .string()
    .min(10, "Title must be at least 10 characters long.")
    .max(150, "Title cannot exceed 150 characters."),
  summaryPoC: z.string().min(30, "Please provide a detailed Proof of Concept (at least 30 characters)."),
  impact: z.string().optional(),
  remediation: z.string().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must confirm adherence to ethical guidelines and terms.",
  }),
});

export type SubmitReportFormValues = z.infer<typeof submitReportSchema>;
