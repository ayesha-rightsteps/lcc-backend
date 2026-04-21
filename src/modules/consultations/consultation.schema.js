import { z } from 'zod';

export const requestConsultationSchema = z.object({
  body: z.object({
    reason: z.string().min(5, 'Please provide a clear reason for the consultation')
  })
});

export const acceptConsultationSchema = z.object({
  body: z.object({
    meetingLink: z.string().url('Must be a valid URL'),
    meetingDate: z.string().datetime(),
    meetingTime: z.string().min(4, 'Required time string')
  })
});

export const rejectConsultationSchema = z.object({
  body: z.object({
    rejectionReason: z.string().optional()
  })
});

export const completeConsultationSchema = z.object({
  body: z.object({
    status: z.literal('completed'),
    paymentStatus: z.enum(['not_applicable', 'paid']),
    paymentAmount: z.number().nonnegative().optional()
  })
});
