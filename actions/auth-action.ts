'use server';

import { db } from '@/lib/db';
import { loginSchema, registerSchema } from '@/schemas/auth.schema';
import { createClient } from '@/utils/supabase/server';
import { Provider } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// SIGNUP CREDENTIALS
export async function signUp(values: z.infer<typeof registerSchema>) {
  const supabase = await createClient();

  const isValid = registerSchema.safeParse(values);
  if (!isValid.success)
    return { error: 'Invalid credentials, please complete your data' };

  const data = {
    email: isValid.data.email,
    password: isValid.data.password,
    options: {
      data: { name: isValid.data.name },
    },
  };

  const hasAlreadyUserEmail = await db.users.findFirst({
    where: { email: isValid.data.email },
  });

  if (hasAlreadyUserEmail && hasAlreadyUserEmail.email)
    return { error: 'Email has already use' };

  const { error } = await supabase.auth.signUp(data);
  if (error) return { error: 'Invalid credentials, please complete your data' };

  revalidatePath('/', 'layout');
  return {
    success: 'Email verification has send',
    payLoad: {
      ...data,
    },
  };
}

// SIGNIN CREDENTIALS
export const signIn = async (value: z.infer<typeof loginSchema>) => {
  const supabase = await createClient();

  const isValid = loginSchema.safeParse(value);
  if (!isValid.success)
    return { error: 'Invalid credentials, please complete your data' };

  const data = {
    email: isValid.data.email,
    password: isValid.data.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) return { error: 'Wrong email or password' };

  revalidatePath('/', 'layout');
  redirect('/');
};

// SIGN IN OAUTH
export const signInWithOAuth = async (provider: Provider) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.SITE_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) redirect('auth/error');
  if (data.url) redirect(data.url); // use the redirect API for your server framework
};

// SIGNOUT
export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth/sign-in');
};
