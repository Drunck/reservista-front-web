"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/ui/components/button";
import { useEffect, useState } from "react";
import { activateUser, getUserById, resendActivationCode } from "@/lib/api";
import { LoadingIcon } from "@/ui/components/icons";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "@/lib/hooks/use-auth";
import useMediaQuery from "@/lib/hooks/use-media-query";
import MobileTopNavigationBar from "@/ui/components/mobile-top-navigation-bar";
import { useToast } from "@/components/ui/use-toast";

export default function ActivateAccountPage() {
  const router = useRouter();
  const redirectURL = useSearchParams().get("redirect") || "/";
  const [code, setCode] = useState("");
  const { auth, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { toast } = useToast();

  const resendTimerSeconds = process.env.NEXT_PUBLIC_ACTIVATION_CODE_RESEND_TIMER as unknown as number;
  const [resendTimer, setResendTimer] = useState(resendTimerSeconds);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getUserById(auth.user_id ?? "");
      if (response !== null && response !== undefined) {
        setEmail(response?.email);
      } else {
        setErrorMessage("An error occurred while fetching your account details. Please try again.");
      }
    };

    if (auth.isAuth) {
      fetchUser();
    }
  }, [auth.user_id, auth.isAuth]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [resendTimer]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrorMessage("");

    if (!code) {
      setErrorMessage("Please enter the activation code.");
      return;
    }

    setIsSubmitting(true);
    const response = await activateUser({ Code: code });
    if (response && response.status === 200) {
      router.push(redirectURL);
    } else {
      setErrorMessage(response.message);
    }
    setIsSubmitting(false);
  }

  const handleResendActivationCode = async (e: React.MouseEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setResendTimer(resendTimerSeconds);
    const response = await resendActivationCode();
    if (response.message === "Activation code sent") {
      toast({
        variant: "green",
        title: "Activation code sent",
        description: "A new activation code has been sent to your email.",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Problem while resending the activation code.",
        description: "An error occurred while resending the activation code. Please try again later.",
      })
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      {!isDesktop &&
        <MobileTopNavigationBar menuName="Account verification" />
      }
      <div className="flex flex-col mt-20 items-center lg:justify-center w-full md:h-screen lg:mt-0">
        <div className="w-full max-w-md md:max-w-xl flex flex-col justify-center items-center md:px-8 md:py-14 bg-white rounded-lg gap-y-5 md:shadow-md md:border">
          <h1 className="text-4xl font-bold mt-4 md:mt-0 hidden lg:block">Verification code</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-8 items-center w-full">
            <span className="text-gray-500 text-sm text-center">We&apos;ve sent a verification code to your email, <span className="font-bold text-black">{email}</span>, to activate your account. Please check your inbox.</span>
            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={code} onChange={(code) => setCode(code)}>
              {[...Array(6)].map((_, index) => (
                <InputOTPGroup key={index}>
                  <InputOTPSlot className="border-black" index={index} />
                </InputOTPGroup>
              ))}
            </InputOTP>
            <div className="text-sm text-gray-500 flex gap-x-1">
              <span>Didn&apos;t receive the code?</span>
              {resendTimer > 0 ? (
                <span className="text-gray-500">{`Resend in ${formatTime(resendTimer)}`}</span>
              ) : (
                <button onClick={handleResendActivationCode} className="text-blue-500 hover:text-blue-700 active:text-blue-700" type="button">
                  Resend
                </button>
              )}
            </div>
            {errorMessage && <span className="text-red-500 text-sm">{errorMessage}</span>}
            <Button type="submit" className={`px-4 py-2 rounded-md w-full max-w-40 ${isSubmitting ? 'bg-gray-300 cursor-not-allowed' : ''}`} disabled={isSubmitting} >
              {isSubmitting ? <LoadingIcon className="w-6 h-6" /> : "Verify"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
