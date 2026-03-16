"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const errorData = {
      type: "client_error",
      boundary: "dashboard",
      name: error.name,
      message: error.message,
      digest: error.digest,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      timestamp: new Date().toISOString(),
    };
    console.error("[ErrorBoundary:Dashboard]", JSON.stringify(errorData));
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <h2 className="text-xl font-semibold text-zinc-100">
        Something went wrong
      </h2>
      <p className="text-sm text-zinc-400 max-w-md text-center">
        An error occurred while loading this page. Please try again.
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
