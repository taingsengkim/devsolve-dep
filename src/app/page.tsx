import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <span className="text-lg font-semibold tracking-tight text-foreground">DevSolve</span>
        <div className="flex items-center gap-3">
          <Link className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" href="/login">
            Log in
          </Link>
          <Link className={buttonVariants()} href="/signup">
            Sign up
          </Link>
        </div>
      </nav>
    </main>
  );
}
