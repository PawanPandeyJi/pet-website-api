import { z } from "zod";

export const userValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: "First Name, minimum of 2 char" })
    .max(15, { message: "First Name, maximum of 15 char" })
    .refine((val) => /^[a-zA-Z ]+$/.test(val), {
      message: "First Name must have only alphabets",
    }),

  lastName: z
    .string()
    .trim()
    .min(2, { message: "Last Name, minimum of 2 char" })
    .max(15, { message: "Last Name, maximum of 15 char" })
    .refine((val) => /^[a-zA-Z ]+$/.test(val), {
      message: "Last Name must have only alphabets",
    }),

  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string()
    .refine(
      (val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(val),
      { message: "Password must like: Example@123" }
    ),
  type: z.enum(["user", "doctor"]),
});

export type user = z.infer<typeof userValidationSchema>;

export const userLoginValidationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .refine(
      (val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(val),
      { message: "Password must like: Example@123" }
    ),
  type: z.enum(["user", "doctor"]),
});

export type userLogin = z.infer<typeof userLoginValidationSchema>;
