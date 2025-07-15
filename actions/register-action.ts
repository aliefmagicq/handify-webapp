'use server';

import { db } from '@/lib/db';
import { formSchema } from '@/schemas/register-form';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import z from 'zod';

export async function signUp(values: z.infer<typeof formSchema>) {
  const supabase = await createClient();

  const isValid = formSchema.safeParse(values);
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
