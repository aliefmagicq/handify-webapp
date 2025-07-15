'use client';
import { FaGoogle } from 'react-icons/fa';

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

import { logIn } from '@/actions/login-action';
import { formSchema } from '@/schemas/login-form';
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setTransition(async () => {
      await logIn(values).then(data => {
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
            onClick={() => router.push('/auth/register')}
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

          <Button disabled={isPending}>LogIn</Button>

          <Button disabled={isPending} variant="outline">
            <FaGoogle />
          </Button>
        </form>
      </Form>
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
        <CardTitle>Login</CardTitle>
        <CardDescription>to continue to Handify</CardDescription>
        <CardAction>Handify</CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>{footer}</CardFooter>
    </Card>
  );
};
