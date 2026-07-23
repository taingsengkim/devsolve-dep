import { z } from "zod";

const registerSchema = z
  .object({
    username: z.string().trim().min(1, "Username is required."),
    password: z.string().min(1, "Password is required."),
    confirmPassword: z.string().min(1, "Confirm password is required."),
    email: z.string().trim().email("Enter a valid email address.").optional().or(z.literal("")),
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    phone: z.string().regex(/^\d{9,11}$/, "Phone number must contain 9 to 11 digits."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const registrationApiUrl = `${(process.env.AUTH_API_URL ?? "http://localhost:8999").replace(/\/$/, "")}/api/v1/auth/register`;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid registration details." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(registrationApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });
    const contentType = response.headers.get("content-type") ?? "application/json";
    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: { "Content-Type": contentType },
    });
  } catch {
    return Response.json(
      { message: "The registration service is unavailable." },
      { status: 503 },
    );
  }
}
