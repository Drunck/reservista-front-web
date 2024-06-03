import Link from 'next/link';
import SignUpFormComponent from './form';
import { kumbh_sans } from '../../../ui/fonts';

export default function SignUp() {
  return (
    <main className="flex flex-col items-center px-4 md:h-screen text-sm md:text-base">
      <div className="flex flex-col items-center justify-center w-full h-full pb-14 md:pb-0 md:0 md:py-14">
        <Link href="/" className={`text-7xl ${kumbh_sans.className} font-bold mt-20 md:hidden`}>reservista</Link>
        <p className="text-lg text-center my-4 md:m-0 md:text-2xl md:max-w-m max-w-xs md:mb-5 md:font-bold text-balance">Sign up for an account to get started</p>
        <div className="mt-5 w-full max-w-md">
            <SignUpFormComponent />
        </div>
        <p className="my-4 mb-10 text-sm">Already have an account? <Link className="font-medium text-blue-500 hover:text-blue-700" href="/sign-in">Sign in</Link></p>
      </div>
    </main>
  )
}
