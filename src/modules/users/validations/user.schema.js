import { z } from 'zod';

export const createStudentSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(5, 'Valid phone number is required'),
    courseName: z.string().min(2, 'Course name is required'),
    courseDuration: z.number().int().positive('Course duration must be a positive number'),
    paymentAmount: z.number().nonnegative('Payment amount cannot be negative'),
    paymentDate: z.string().datetime().optional(),
    category: z.string().min(1, 'Category is required'),
  }),
});

export const heartbeatSchema = z.object({
  body: z.object({
    lat: z.number().optional(),
    lng: z.number().optional()
  })
});

export const updateStatusSchema = z.object({
  body: z.object({
    action: z.enum(['deactivate', 'block', 'reactivate', 'extend_validity']),
    extendedDays: z.number().int().positive().optional()
  }).refine((data) => {
    if (data.action === 'extend_validity' && !data.extendedDays) {
      return false;
    }
    return true;
  }, {
    message: 'extendedDays must be provided when action is extend_validity',
    path: ['extendedDays']
  })
});

export const updateStudentSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    phone: z.string().min(5).optional(),
    courseName: z.string().min(2).optional(),
    courseDuration: z.number().int().positive().optional(),
    paymentAmount: z.number().nonnegative().optional(),
    category: z.string().nullable().optional(),
  }),
});

export const setPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    sendEmail: z.boolean().optional(),
  }),
});

export const updateIpsSchema = z.object({
  body: z.object({
    action: z.enum(['reset', 'block_ip']),
    ipToBlock: z.string().optional()
  }).refine((data) => {
    if (data.action === 'block_ip' && !data.ipToBlock) {
      return false;
    }
    return true;
  }, {
    message: 'ipToBlock must be provided when action is block_ip',
    path: ['ipToBlock']
  })
});
