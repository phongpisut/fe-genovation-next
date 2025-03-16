import { z } from 'zod';

export const ProfileSchema = z.object({
  fullname: z.string().min(1, 'Full name is required.'),
  notes: z.string().optional(),
  specialty: z.string().optional(),
  tel: z.string().optional(),
  timeStart: z.string().optional(),
  timeEnd: z.string().optional(),
  workDay: z.array(z.string()).min(1, 'Day of work is required.').optional(),
});

export type ProfileData = z.infer<typeof ProfileSchema>;
