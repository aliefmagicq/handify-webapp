'use client';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { signIn, signInWithOAuth } from '@/actions/auth-action';
import { loginSchema } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ReactNode, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const LoginForm = () => {
  const router = useRouter();
  const [isPending, setTransition] = useTransition();
  const [isError, setIsError] = useState<string>('');

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setTransition(async () => {
      await signIn(values).then(data => {
        setIsError(data && data.error && data.error);
        if (data.error) toast.error(data.error);
      });
    });
  };

  return (
    <CardFormLogin
      footer={
        <div className="w-full flex items-center justify-center gap-1">
          <span className="opacity-60">Don&apos;t have an account?</span>
          <span
            className="cursor-pointer opacity-60 hover:opacity-100"
            onClick={() => router.push('/auth/sign-up')}
          >
            Sign up
          </span>
        </div>
      }
    >
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="w-[300px]"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className="w-[300px]"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex items-center justify-center">
            {isError && <span className="opacity-60">{isError}</span>}
          </div>

          <Button disabled={isPending}>Sign In</Button>
        </form>
      </Form>
      <Button
        className="w-full mt-4"
        variant="outline"
        disabled={isPending}
        onClick={() => signInWithOAuth('google')}
      >
        Sign in With Google
      </Button>
    </CardFormLogin>
  );
};

export default LoginForm;

const CardFormLogin = ({
  children,
  footer,
}: {
  children: ReactNode;
  footer: ReactNode;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3>Sign In</h3>
        </CardTitle>
        <CardDescription>
          Welcome to handify, Sign in to continue
        </CardDescription>
        <CardAction>Handify</CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>{footer}</CardFooter>
    </Card>
  );
};
