import { z } from 'zod';

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    phone: z.string().min(7, 'Valid phone number is required'),
    email: z.string().email().optional().or(z.literal('')),
    branch: z.enum(['Pak Army', 'Pak Air Force', 'Pak Navy']),
    course: z.string().min(2, 'Course is required'),
    message: z.string().optional(),
  }),
});

export const updateLeadStatusSchema = z.object({
  body: z.object({
    status: z.enum(['new', 'contacted', 'closed']),
  }),
});
