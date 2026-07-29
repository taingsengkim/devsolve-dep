

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({
  error,
  reset,
}: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-10 text-center shadow-lg">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle
            size={42}
            className="text-red-600"
          />
        </div>

        <h1 className="text-3xl font-bold">
          Something went wrong
        </h1>

        <p className="mt-3 text-gray-600">
          We couldn't load this discussion page.
          Please try again.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={18} />
            Try Again
          </button>

          <Link
            href="/discussions"
            className="rounded-lg border px-5 py-3 transition hover:bg-gray-100"
          >
            Back
          </Link>
        </div>
      </div>
    </main>
  );
}