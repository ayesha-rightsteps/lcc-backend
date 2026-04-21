import { z } from 'zod';

export const createTicketSchema = z.object({
  body: z.object({
    subject: z.string().min(2, 'Subject is required'),
    message: z.string().min(2, 'Message is required'),
  })
});

export const replyTicketSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'Message cannot be empty')
  })
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['open', 'in_progress', 'resolved', 'closed'])
  })
});
