"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

const signupSchema = z
  .object({
    username: z.string().trim().min(1, "Username is required."),
    password: z.string().min(1, "Password is required."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
    email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    phone: z.string().regex(/^\d{9,11}$/, "Phone number must contain 9 to 11 digits."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignupFields = z.infer<typeof signupSchema>;
type FieldErrors = Partial<Record<keyof SignupFields, string>>;

function getFieldErrors(error: z.ZodError): FieldErrors {
  return error.issues.reduce<FieldErrors>((errors, issue) => {
    const field = issue.path[0] as keyof SignupFields | undefined;

    if (field && !errors[field]) {
      errors[field] = issue.message;
    }

    return errors;
  }, {});
}

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const values = {
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
      email: String(formData.get("email") ?? ""),
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
    };
    const validation = signupSchema.safeParse(values);

    if (!validation.success) {
      setFieldErrors(getFieldErrors(validation.error));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setFormError(payload?.message ?? "We couldn't create your account. Please try again.");
        return;
      }

      router.push("/");
    } catch {
      setFormError("Unable to reach the registration service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-7" noValidate onSubmit={handleSubmit}>
      <FieldGroup>
        <Field data-invalid={Boolean(fieldErrors.username)}>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input id="username" name="username" autoComplete="username" aria-invalid={Boolean(fieldErrors.username)} placeholder="devsolver" required />
          <FieldError>{fieldErrors.username}</FieldError>
        </Field>

        <Field data-invalid={Boolean(fieldErrors.email)}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" autoComplete="email" aria-invalid={Boolean(fieldErrors.email)} placeholder="you@company.com" required />
          <FieldError>{fieldErrors.email}</FieldError>
        </Field>

        <FieldGroup className="grid gap-7 sm:grid-cols-2">
          <Field data-invalid={Boolean(fieldErrors.firstName)}>
            <FieldLabel htmlFor="firstName">First name</FieldLabel>
            <Input id="firstName" name="firstName" autoComplete="given-name" aria-invalid={Boolean(fieldErrors.firstName)} placeholder="Alex" required />
            <FieldError>{fieldErrors.firstName}</FieldError>
          </Field>

          <Field data-invalid={Boolean(fieldErrors.lastName)}>
            <FieldLabel htmlFor="lastName">Last name</FieldLabel>
            <Input id="lastName" name="lastName" autoComplete="family-name" aria-invalid={Boolean(fieldErrors.lastName)} placeholder="Morgan" required />
            <FieldError>{fieldErrors.lastName}</FieldError>
          </Field>
        </FieldGroup>

        <Field data-invalid={Boolean(fieldErrors.phone)}>
          <FieldLabel htmlFor="phone">Phone number</FieldLabel>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" aria-invalid={Boolean(fieldErrors.phone)} inputMode="numeric" placeholder="123456789" required />
          <FieldError>{fieldErrors.phone}</FieldError>
        </Field>

        <Field data-invalid={Boolean(fieldErrors.password)}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" name="password" type="password" autoComplete="new-password" aria-invalid={Boolean(fieldErrors.password)} required />
          <FieldError>{fieldErrors.password}</FieldError>
        </Field>

        <Field data-invalid={Boolean(fieldErrors.confirmPassword)}>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" aria-invalid={Boolean(fieldErrors.confirmPassword)} required />
          <FieldError>{fieldErrors.confirmPassword}</FieldError>
        </Field>
      </FieldGroup>

      {formError ? <p className="text-sm text-destructive" role="alert">{formError}</p> : null}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
