"use client";

export default function GlobalError({ error, reset, }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="flex flex-col w-full">
      <h1>404 - Page Not Found</h1>
    </div>
  )
}
