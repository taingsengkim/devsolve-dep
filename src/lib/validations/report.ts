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

export const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"] as const;
export const ENVIRONMENTS = ["Production", "Staging", "Development"] as const;

export const submitReportSchema = z.object({
  // Step 1: Target & Scope
  programId: z.string().min(1, "Please select a target program."),
  targetAsset: z.string().min(2, "Target asset or endpoint URL is required."),
  httpMethod: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"]),
  vulnerableParameter: z.string().optional(),
  environment: z.enum(["Production", "Staging", "Development"]),

  // Step 2: Vulnerability Classification
  title: z
    .string()
    .min(10, "Title must be at least 10 characters long.")
    .max(150, "Title cannot exceed 150 characters."),
  category: z.string().min(1, "Please select a vulnerability type/category."),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]),
  cweIdentifier: z.string().optional(),
  cvssScore: z.string().optional(),
  cvssVector: z.string().optional(),

  // Step 3: Report Details
  summaryPoC: z.string().min(20, "Please provide a description/summary (at least 20 characters)."),
  reproduceStepsList: z.array(z.string()),
  impact: z.string().optional(),
  remediation: z.string().optional(),

  // Step 4: Proof of Concept
  pocPayload: z.string().optional(),
  expectedResult: z.string().optional(),
  actualResult: z.string().optional(),
  externalLinks: z.array(z.string()),

  // Step 5: Submission Checklist
  checklistInScope: z.boolean(),
  checklistNotDuplicate: z.boolean(),
  checklistReproducible: z.boolean(),
  checklistNoPii: z.boolean(),
  checklistAgreeTerms: z.boolean(),
});

export type SubmitReportFormValues = z.infer<typeof submitReportSchema>;

