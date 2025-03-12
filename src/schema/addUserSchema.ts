import { z } from "zod";


export const loginSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.string().default("doctor"),
  notes: z.string().optional(),
  specialty: z.string().optional(),
  timeslot: z.record(z.string(),z.array(z.string())),



});

export type LoginSchemaType = z.infer<typeof loginSchema>;