"use client";

import { Button } from "@/ui/components/button";
import { useRouter } from "next/navigation";

export default function Error() {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-y-5">
      <h1>404</h1>
      <div className="flex flex-col justify-center items-center">
        <h2>Something went wrong!</h2>
        The page you were looking for doesn&apos;t exist
      </div>
      <Button onClick={() => { router.push("/") }}>Back to Homepage</Button>
    </div>
  )
}