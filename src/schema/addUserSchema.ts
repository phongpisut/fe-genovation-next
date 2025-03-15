import { z } from "zod";


export const loginSchema = z.object({
  Fullname: z.string().min(1, "Full name is required"),
  notes: z.string().optional(),
  specialty: z.string().optional(),
  dayOfWeek: z.array(z.string()).optional(),
  timeslot: z.record(z.string(),z.array(z.string())).optional(),
  tel: z.string().min(10, "Invalid phone number").optional(),



});

export type LoginSchemaType = z.infer<typeof loginSchema>;