import { z } from "zod";

export const doctorValidationSchema = z.object({
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "DOB must be a valid date in YYYY-MM-DD format",
  }),
  gender: z.enum(["male", "female", "other"], {
    message: "Gender must be one of 'male', 'female', or 'other'",
  }),
  phone: z
    .string()
    .trim()
    .regex(/^([6-9]{1}[0-9]{9})$/, { message: "Invalid Phone no." }),
  qualification: z
    .string()
    .trim()
    .min(2, { message: "Qualification must have at least 2 characters" }),
  specialization: z
    .string()
    .trim()
    .min(2, { message: "Specialization must have at least 2 characters" }),
  licenseNumber: z
    .string()
    .trim()
    .min(5, { message: "License Number must have at least 5 characters" }),
  address: z.string().trim().min(5, { message: "Address must have at least 5 characters" }),
  profileImage: z.string().url({ message: "Profile Image must be a valid URL" }).optional(),
  certificateImage: z.string().url({ message: "Certificate Image must be a valid URL" }).optional(),
  isDeleted: z.boolean().optional(),
  isApproved: z.boolean().optional(),
  // availableDays: z.enum([]),
  availableDays: z
    .array(z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]))
    .nonempty({ message: "Available Days must have at least one day" }),
  availableTime: z.string().nonempty({ message: "Time is required!" }),
});
