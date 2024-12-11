import { z } from "zod";

export const petValidationSchema = z.object({
  petName: z
    .string()
    .trim()
    .min(2, { message: "Pet Name, minimum of 2 char" })
    .refine((val) => /^[a-zA-Z ]+$/.test(val), {
      message: "Pet Name must have only alphabets",
    }),

  age: z
    .string()
    .trim()
    .min(2, { message: "Age, minimum of 2 char" })
    .max(15, { message: "Age, maximum of 15 char" }),

  breed: z
    .string()
    .trim()
    .min(2, { message: "Pet breed, minimum of 2 char" })
    .refine((val) => /^[a-zA-Z ]+$/.test(val), {
      message: "Pet breed must have only alphabets",
    }),

  weight: z.string().trim().min(2, { message: "Pet weight, minimum of 2 char" }),

  type: z.string().trim().min(2, { message: "Pet type, minimum of 2 char" }),

  gender: z.enum(["male", "female"]),

  color: z.string().trim().min(2, { message: "Pet color, minimum of 2 char" }),
});

export type pet = z.infer<typeof petValidationSchema>;
