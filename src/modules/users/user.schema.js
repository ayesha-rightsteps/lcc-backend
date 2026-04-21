import { z } from 'zod';

export const createStudentSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(5, 'Valid phone number is required'),
    courseName: z.string().min(2, 'Course name is required'),
    courseDuration: z.number().int().positive('Course duration must be a positive number'),
    paymentAmount: z.number().nonnegative('Payment amount cannot be negative'),
    paymentDate: z.string().datetime().optional(), // ISO string, defaults to now if not provided
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
    message: "extendedDays must be provided when action is extend_validity",
    path: ["extendedDays"]
  })
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
    message: "ipToBlock must be provided when action is block_ip",
    path: ["ipToBlock"]
  })
});
