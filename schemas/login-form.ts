import z from 'zod';

const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export const formSchema = z.object({
  email: z.email().min(2, { message: 'Must have at least 2 characters' }),
  password: z
    .string()
    .min(8, { message: 'Must have at least 8 characters' })
    .regex(passwordValidation, { message: 'Must containt special characters' }),
});
