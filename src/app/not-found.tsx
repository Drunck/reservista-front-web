"use client";

import { Button } from "@/ui/custom-components/button";
import { useRouter } from "next/navigation";

export default function Error() {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-y-5">
      <span className="text-3xl font-bold">404</span>
      <div className="flex flex-col justify-center items-center">
        <h2>Something went wrong!</h2>
        The page you were looking for doesn&apos;t exist
      </div>
      <Button onClick={() => { router.push("/") }}>Back to Homepage</Button>
    </div>
  )
}