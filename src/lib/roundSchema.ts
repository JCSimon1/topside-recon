import { z } from "zod";

export const roundFormSchema = z.object({
  number: z.number().int().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  map: z.string().trim().min(1, "Pflichtfeld"),
  condition: z.string().trim().min(1, "Pflichtfeld"),
  money: z.number({ error: "  Bitte eine Zahl eingeben." }).int(),
  xp: z.number({ error: "Bitte eine Zahl eingeben." }).int(),
});

export type RoundFormValues = z.infer<typeof roundFormSchema>;
