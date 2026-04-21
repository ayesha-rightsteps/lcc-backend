import { z } from 'zod';

export const createAlertSchema = z.object({
  body: z.object({
    alertType: z.enum(['screenshot_attempt', 'screen_recording', 'dev_tools_opened', 'suspicious_activity']),
    description: z.string().optional()
  })
});
