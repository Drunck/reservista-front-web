"use client";
import { signUpUser } from '@/lib/api';
import useAuth from '@/lib/hooks/use-auth';
import { SignUpSchema, TSignUp } from '@/lib/types';
import { Button } from '@/ui/custom-components/button';
import { CheckMarkIcon, DangerCircleIcon, LoadingIcon } from '@/ui/custom-components/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

type FormErrors = {
  name?: string;
  surname?: string;
  phone?: string;
  email?: string;
  password?: string;
}

export default function SignUpFormComponent() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [phoneNum, setPhoneNum] = useState("");
  const [formInputData, setFormInputData] = useState<TSignUp>({
    name: "",
    surname: "",
    phone: phoneNum,
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
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
    if (!formInputData.email && !formInputData.password && !formInputData.name && !formInputData.surname && phoneNum.length < 3) {
      setErrors({});
    } else {
      formInputData.phone = phoneNum;
      const result = SignUpSchema.safeParse(formInputData);
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
  }, [formInputData, phoneNum]);

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setServerError("");

    const result = SignUpSchema.safeParse(formInputData);
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
    const response = await signUpUser(formInputData);

    if (response?.errors) {
      let errorObject = response.errors.reduce((acc, error) => {
        return {
          ...acc,
          ...error
        };
      }, {} as FormErrors);
      setErrors(errorObject);
    } else if (response?.serverError) {
      setServerError(response.serverError);
    } else {
      setAuth({ isAuth: true });
      router.push("/activate");
    }

    setFormInputData(prev => ({
      ...prev,
      name: "",
      surname: "",
      phone: "",
      email: "",
      password: ""
    }));
    setPhoneNum("")

    setIsLoading(false);
  };
  return (
    <form className="flex flex-col w-full max-w-xl">
      {serverError &&
        <span className="text-md bg-red-100/80 text-red-500 font-medium rounded-md border border-red-400 mb-4 flex items-center ">
          <DangerCircleIcon className="w-8 h-8 m-3 fill-red-700" />
          {serverError}
        </span>
      }
      <div className="flex flex-col w-full">
        <label htmlFor="firstname" className="text-sm font-medium">First name</label>
        <input type="text" id="firstname" name="name" className={`mt-1 py-2 px-3 border border-gray-300 rounded-md ${errors.name ? "border-red-400 bg-red-50 focus-visible:outline-red-500" : "border-gray-300"}`} value={formInputData.name} onChange={handleChange} required />
        {errors?.email && <span className="text-sm text-red-400 mt-1">{errors.name}</span>}
      </div>
      <div className="flex flex-col w-full">
        <label htmlFor="lastname" className="text-sm font-medium mt-4">Last name</label>
        <input type="text" id="lastname" name="surname" className={`mt-1 py-2 px-3 border border-gray-300 rounded-md ${errors.surname ? "border-red-400 bg-red-50 focus-visible:outline-red-500" : "border-gray-300"}`} value={formInputData.surname} onChange={handleChange} required />
        {errors?.email && <span className="text-sm text-red-400 mt-1">{errors.surname}</span>}
      </div>
      <div className="flex flex-col w-full">
        <label htmlFor="phone" className="text-sm font-medium mt-4">Phone number</label>
        <PhoneInput name="phone" className={`mt-1 phone-input coutry-selector country-selector-dropdown dial-code-preview' ${errors.phone ? "phone-input-error" : ""}`} inputStyle={{ "width": "100%" }} value={phoneNum} onChange={setPhoneNum} required />
        {errors?.phone && <span className="text-sm text-red-400 mt-1">{errors.phone}</span>}
      </div>
      <div className="flex flex-col w-full">
        <label htmlFor="email" className="text-sm font-medium mt-4">Email</label>
        <input type="email" id="email" name="email" className={`mt-1 py-2 px-3 border border-gray-300 rounded-md ${errors.email ? "border-red-400 bg-red-50 focus-visible:outline-red-500" : "border-gray-300"}`} autoComplete="username" value={formInputData.email} onChange={handleChange} required />
        {errors?.email && <span className="text-sm text-red-400 mt-1">{errors.email}</span>}
      </div>
      <div className="flex flex-col w-full">
        <label htmlFor="password" className="text-sm font-medium mt-4">Password</label>
        <input type={`${showPassword ? "text" : "password"}`} id="password" name="password" className={`mt-1 py-2 px-3 border border-gray-300 rounded-md ${errors.password ? "border-red-400 bg-red-50 focus-visible:outline-red-500" : "border-gray-300"}`} autoComplete="current-password" value={formInputData.password} onChange={handleChange} required />
        {errors?.password && <span className="text-sm text-red-400 mt-1">{errors.password}</span>}
      </div>
      <div className="flex relative items-center mt-4">
        <div className="flex relative items-center">
          <input type="checkbox" id="show-password" name="show-password" className="peer relative mr-2 appearance-none transition cursor-pointer min-w-5 min-h-5 border border-gray-300 rounded-sm checked:border-black checked:rounded-[4px] checked:bg-black active:shadow-[0px_0px_5px_0px_#333333]" onClick={handleCheckboxChange} />
          <span className="absolute text-white opacity-0 pointer-events-none peer-checked:opacity-100 left-[2px]">
            <CheckMarkIcon className="w-4 h-4" />
          </span>
          <label htmlFor="show-password" className="text-sm font-medium">Show password</label>
        </div>
      </div>
      <Button className="mt-10 rounded-md p-2" disabled={isLoading} onClick={handleSubmit}>
        {isLoading ? <LoadingIcon className="w-5 h-5" /> : "Sign up"}
      </Button>
    </form>
  )
}
