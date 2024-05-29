"use client";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/ui/components/button";
import { useState } from "react";
import { activateUser } from "@/lib/api";

export default function ActivateAccountPage() {
  const [code, setCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const response = await activateUser(code);

    if (response.message === "renew your activation code") {
      alert("Your activation code has expired. Please request a new one.");
    }
    console.log("RESPONSE", response);
    setIsSubmitting(false);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <div className="flex flex-col items-center justify-center w-full max-w-md p-8 bg-white rounded-lg gap-y-5 shadow-[0px_4px_12px_0px_#0000000D] border">
        <h1 className="text-3xl font-bold text-center">Activate your account</h1>
        <p className="text-center text-gray-500">We've sent you an email with a verification code to activate your account. Please check your inbox.</p>
        <input type="text" className="px-4 py-2 rounded-md border border-gray-300" placeholder="Enter your verification code" value={code} onChange={handleChange} />
        <Button className="px-4 py-2 rounded-md max-w-64" onClick={handleSubmit}>Activate</Button>
      </div>
    </div>
  )
}

type InputOTPPatternProps = {
  values: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputOTPPattern({values, onChange}: InputOTPPatternProps) {
  return (
    <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}
