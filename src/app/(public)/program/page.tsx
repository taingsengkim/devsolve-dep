import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function Page() {
  return (
    <main className="min-h-[100dvh] bg-background">
      <section className="flex min-h-[100dvh] items-center justify-center px-4">
        <div className="text-center">
          <p className="text-base text-muted-foreground">
            The public program content has been removed.
          </p>
          <Link
            href="/account-type"
            className={`${buttonVariants({ variant: "link" })} mt-2 text-lg font-bold`}
          >
            Create Account
          </Link>
        </div>
      </section>
    </main>
  );
}
