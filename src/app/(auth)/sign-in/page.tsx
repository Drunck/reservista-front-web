import Link from 'next/link';
import SignInFormComponent from './form';
import { kumbh_sans } from '../../../ui/fonts';

export default function SignIn() {
  return (
    <main className="flex flex-col items-center px-4">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Link href="/" className={`text-7xl ${kumbh_sans.className} font-bold mt-20`}>reservista</Link>
        <p className="text-lg mt-4">Welcome back! Sign in to your account to continue.</p>
        <div className="mt-5 w-full max-w-md">
          <SignInFormComponent />
        </div>
        <p className="mt-4">Don't have an account? <Link className="font-medium text-blue-500 hover:text-blue-700" href="/sign-up">Create an Account</Link></p>
      </div>
    </main>
  )
}
