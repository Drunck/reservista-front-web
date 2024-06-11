"use client";

import { signInUser } from '@/lib/api';
import { SignInSchema, TSignIn } from '@/lib/types';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/ui/custom-components/button';
import { DangerCircleIcon, CheckMarkIcon, LoadingIcon, GreenSuccessCircleIcon } from '@/ui/custom-components/icons';
import useAuth from '@/lib/hooks/use-auth';

type FormErrors = {
  email?: string;
  password?: string;
}

export default function SignInFormComponent() {
  const router = useRouter();
  const redirectURL = useSearchParams().get("redirect")?.toString() || "/";
  const { setAuth } = useAuth();
  const [formInputData, setFormInputData] = useState<TSignIn>({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = () => {
    setShowPassword(prevState => !prevState);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInputData({
      ...formInputData,
      [e.target.name]: e.target.value
    });
  }

  useEffect(() => {
    setFormSuccess(false);
    if (!formInputData.email && !formInputData.password) {
      setErrors({});
    } else {
      const result = SignInSchema.safeParse(formInputData);

      if (!result.success) {
        let validationErrors = result.error.issues.reduce((acc, issue) => {
          return {
            ...acc,
            [issue.path[0]]: issue.message
          };
        }, {} as FormErrors);

        setErrors(validationErrors);
      } else {
        setErrors({});
      }
    }
  }, [formInputData]);

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setServerError("");

    const result = SignInSchema.safeParse(formInputData);
    if (!result.success) {
      let validationErrors = result.error.issues.reduce((acc, issue) => {
        return {
          ...acc,
          [issue.path[0]]: issue.message
        };
      }, {} as FormErrors);
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    const response = await signInUser(formInputData);

    if (response?.errors) {
      let errorObject = response.errors.reduce((acc, error) => {
        return {
          ...acc,
          ...error
        };
      }, {} as FormErrors);
      setErrors(errorObject);
    } else if (response?.serverError && response?.serverError === "user is not verified") {
      setFormSuccess(true);
      setAuth({ isAuth: true});
      router.push(redirectURL);
    } else if (response?.serverError) {
      setServerError(response.serverError);
    } else {
      setFormSuccess(true);
      setAuth({ isAuth: true});
      router.push(redirectURL);
    }

    setFormInputData(prev => ({
      ...prev,
      email: "",
      password: ""
    }));

    setIsLoading(false);
  };

  return (
    <form className="flex flex-col w-full max-w-xl" >
      {formSuccess &&
        <span className="text-md bg-green-500/15 text-green-500 font-medium rounded-md border border-green-400 mb-4 flex items-center ">
          <GreenSuccessCircleIcon className="w-8 h-8 m-3" />
          Sign in successful
        </span>
      }
      {serverError &&
        <span className="text-md bg-red-500/15 text-red-500 font-medium rounded-md border border-red-400 mb-4 flex items-center ">
          <DangerCircleIcon className="w-8 h-8 m-3 fill-red-700" />
          {serverError}
        </span>
      }
      <div className="flex flex-col w-full">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input type="email" id="email" name="email" className={`mt-1 p-2 border rounded-md ${errors?.email ? "border-red-400 bg-red-50 focus-visible:outline-red-500" : "border-gray-300"}`} autoComplete="username" onChange={handleChange} value={formInputData.email} required />
        {errors?.email && <span className="text-sm text-red-400 mt-1">{errors.email}</span>}
      </div>
      <div className="flex flex-col w-full">
        <label htmlFor="password" className="text-sm font-medium mt-4">Password</label>
        <input type={`${showPassword ? "text" : "password"}`} id="password" name="password" className={`mt-1 p-2 border rounded-md ${errors?.password ? "border-red-400 bg-red-50 focus-visible:outline-red-500" : "border-gray-300"}`} autoComplete="current-password" onChange={handleChange} value={formInputData.password} required />
        {errors?.password && <span className="text-sm text-red-400 mt-1">{errors.password}</span>}
      </div>
      <div className="flex justify-between mt-4">
        <div className="flex relative items-center">
          <input type="checkbox" id="show-password" name="show-password" className="peer relative mr-2 appearance-none transition cursor-pointer min-w-5 min-h-5 border border-gray-300 rounded-sm checked:border-black checked:rounded-[4px] checked:bg-black active:shadow-[0px_0px_5px_0px_#333333]" onClick={handleCheckboxChange} />
          <span className="absolute text-white opacity-0 pointer-events-none peer-checked:opacity-100 left-[2px]">
            <CheckMarkIcon className="w-4 h-4" />
          </span>
          <label htmlFor="show-password" className="text-sm font-medium">Show password</label>
        </div>
        <div className="items-center">
          <Link href="#" className="text-sm font-medium text-blue-500 hover:text-blue-700">Forgot password?</Link>
        </div>
      </div>

      <Button className="mt-10 rounded-md p-2" disabled={isLoading} onClick={handleSubmit}>
        {isLoading ? <LoadingIcon className="w-6 h-6 animate-spin" /> : "Sign in"}
      </Button>
    </form>
  )
}
