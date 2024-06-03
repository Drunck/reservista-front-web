import Link from 'next/link';
import SignInFormComponent from './form';
import { kumbh_sans } from '../../../ui/fonts';

export default function SignIn() {
  return (
    <main className="flex flex-col items-center px-4 md:h-screen text-sm md:text-base">
      <div className="flex flex-col items-center justify-center w-full h-full pb-14 md:pb-0 md:0 md:py-14">
        <Link href="/" className={`text-7xl ${kumbh_sans.className} font-bold mt-20 md:hidden`}>reservista</Link>
        <span className="flex flex-col gap-x-2 my-4 max-w-lg text-lg text-center md:text-2xl md:flex-col md:font-bold md:m-0 md:mb-5">
          Welcome back!
          <span className="md:font-medium md:text-xl">
            Sign in to your account to continue.
          </span>
        </span>
        <div className="mt-5 w-full max-w-md">
          <SignInFormComponent />
        </div>
        <p className="mt-4">Don&apos;t have an account? <Link className="font-medium text-blue-500 hover:text-blue-700" href="/sign-up">Create an Account</Link></p>
      </div>
    </main>
  )
}
