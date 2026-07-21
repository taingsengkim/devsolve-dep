import { KeycloakLoginButton } from "@/components/auth/login-button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <main className="flex flex-col items-center text-center gap-6 w-full max-w-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="size-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-base">
            DS
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            DevSolve
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to continue
          </p>
        </div>

        <KeycloakLoginButton className="w-full" />
      </main>
    </div>
  );
}
