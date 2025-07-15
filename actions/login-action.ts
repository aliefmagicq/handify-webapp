'use server';

import { formSchema } from '@/schemas/login-form';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const logIn = async (value: z.infer<typeof formSchema>) => {
  const supabase = await createClient();

  const isValid = formSchema.safeParse(value);
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
