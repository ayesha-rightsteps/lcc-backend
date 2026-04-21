import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    identifier: z.string().min(1, 'Username or email is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});
