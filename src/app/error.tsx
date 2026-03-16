"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Structured client-side error reporting
    const errorData = {
      type: "client_error",
      name: error.name,
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      timestamp: new Date().toISOString(),
    };
    console.error("[ErrorBoundary:Global]", JSON.stringify(errorData));
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 gap-4">
      <h2 className="text-xl font-semibold text-zinc-100">
        Something went wrong
      </h2>
      <p className="text-sm text-zinc-400">
        An unexpected error occurred. Please try again.
      </p>
      {error.digest && (
        <p className="text-xs text-zinc-600 font-mono">
          Error ID: {error.digest}
        </p>
      )}
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
