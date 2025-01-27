import { z } from "zod";

export const PrescriptionSchema = z.object({
  diagnosis: z.string().nonempty("Diagnosis is required"),
  remarks: z.string().optional(),
  appointmentId: z.string().uuid("Appointment ID must be a valid UUID"),
  drugName: z.string().nonempty("Drug name is required"),
  doseTime: z.string().nonempty("Dose time is required"),
  frequency: z.string().nonempty("Frequency is required"),
  dose: z.string().nonempty("Dose is required"),
  drugForm: z.string().nonempty("Drug form is required"),
  duration: z.string().nonempty("Duration is required"),
});
