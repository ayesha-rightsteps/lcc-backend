import { z } from 'zod';

export const createContentSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title is required'),
    type: z.enum(['pdf', 'video']),
    driveId: z.string().min(5, 'Drive ID is required'),
    description: z.string().optional()
  })
});

export const accessControlSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    action: z.enum(['grant', 'revoke'])
  })
});
