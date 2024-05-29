import Link from 'next/link';
import SignUpFormComponent from './form';
import { kumbh_sans } from '../../../ui/fonts';

export default function SignUp() {
  return (
    <main className="flex flex-col items-center px-4">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Link href="/" className={`text-7xl ${kumbh_sans.className} font-bold mt-20`}>reservista</Link>
        <p className="text-lg mt-4">Sign up for an account to get started.</p>
        <div className="mt-5 w-full max-w-md">
            <SignUpFormComponent />
        </div>
        <p className="my-4 mb-10">Already have an account? <Link className="font-medium text-blue-500 hover:text-blue-700" href="/sign-in">Sign in</Link></p>
      </div>
    </main>
  )
}
