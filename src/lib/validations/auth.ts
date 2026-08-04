import * as z from "zod";

// User Registration Form Schema
export const userRegisterSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || /^\d{7,15}$/.test(val), {
        message: "Phone must be 7–15 digits",
      }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    country: z.string().optional(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserRegisterFormValues = z.infer<typeof userRegisterSchema>;

// Company Registration Form Schema
export const companyRegisterSchema = z.object({
  // Step 1 fields
  fullName: z.string().min(2, "Full name is required"),
  jobTitle: z.string().min(1, "Please select a job title"),
  email: z.string().email("Please enter a valid work email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  agreeTermsStep1: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Service",
  }),

  // Step 2 fields
  companyName: z.string().min(2, "Company name is required"),
  companyWebsite: z.string().url("Please enter a valid website URL (e.g. https://readme.org)"),
  industry: z.string().min(1, "Please select an industry"),
  companySize: z.string().min(1, "Please select company size"),
  country: z.string().min(1, "Please select your country"),
  reason: z.string().min(1, "Please select why you are joining"),
  agreeTermsStep2: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms of Service and Privacy Policy",
  }),
});

export type CompanyRegisterFormValues = z.infer<typeof companyRegisterSchema>;
