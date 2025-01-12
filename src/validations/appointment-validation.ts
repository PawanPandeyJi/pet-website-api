import { z } from "zod";

export const appointmentSchema = z.object({
  userId: z.string().nonempty({ message: "UserId not provided" }),

  petId: z.string().nonempty({ message: "Pet not selected" }),

  doctorId: z.string().nonempty({ message: "DoctorId not provided" }),

  appointmentDay: z.string().nonempty({ message: "Appointment Day not selected" }),
});

export type appointment = z.infer<typeof appointmentSchema>;
