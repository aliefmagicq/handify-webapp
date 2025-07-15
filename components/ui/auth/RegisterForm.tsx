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
import { FaGoogle } from 'react-icons/fa';

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

import { signUp } from '@/actions/register-action';
import { formSchema } from '@/schemas/register-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ReactNode, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const RegisterForm = () => {
  const router = useRouter();
  const [isPending, setTransition] = useTransition();
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setTransition(async () => {
      await signUp(values).then(data => {
        setMessage(!data.success ? data.error || '' : data.success || '');
        if (data.error) {
          setIsError(old => !old);
          toast.error(data.error);
        } else {
          toast.success(
            `Email verification has sent To ${data.payLoad?.email}`
          );
        }
      });
    });
  };

  return (
    <CardFormLogin
      footer={
        <div className="w-full flex items-center justify-center gap-1">
          <span className="opacity-60">Already have an account?</span>
          <span
            className="cursor-pointer opacity-60 hover:opacity-100"
            onClick={() => router.push('/auth/login')}
          >
            Sign in
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    className="w-[300px]"
                    placeholder="Enter your name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            {!isError ? (
              <span className="opacity-60">{message}</span>
            ) : (
              <span className="opacity-60">{message}</span>
            )}
          </div>

          <Button>Sign Up</Button>

          <Button variant="outline" disabled={isPending}>
            <FaGoogle />
          </Button>
        </form>
      </Form>
    </CardFormLogin>
  );
};

export default RegisterForm;

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
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>to continue to Handify</CardDescription>
        <CardAction>Handify</CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>{footer}</CardFooter>
    </Card>
  );
};
