import { Button } from '@/components/ui/button';
import Link from 'next/link';

const page = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="flex flex-col">
        <h2>Authentication Error :(</h2>

        <div className="flex items-center gap-1">
          <span className="opacity-60">
            An error occurred during the authentication process. Please try
            again.
          </span>
          <Link href="/auth/sign-in">Back to Sign-In Page</Link>
        </div>
      </div>
    </div>
  );
};

export default page;
