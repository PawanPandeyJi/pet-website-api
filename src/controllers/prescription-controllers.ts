import { Request, Response } from "express";
import { Prescription, PrescriptionAttributes } from "../models/prescription-model";
import { Medicine, MedicineCreationAttribute } from "../models/medicine-model";
import { sequelize } from "../utils/db";
import { Appointment } from "../models/appointment-model";
import { Doctor } from "../models/doctor-model";
import { Op } from "sequelize";

export const createPrescription = async (
  req: Request<
    Record<string, string>,
    void,
    PrescriptionAttributes & { medicines: MedicineCreationAttribute[] }
  >,
  res: Response
): Promise<void> => {
  const prescriptionTransaction = await sequelize.transaction();

  try {
    const { diagnosis, remarks, appointmentId, medicines } = req.body;

    const [prescriptionDetail, created] = await Prescription.findOrCreate({
      where: { appointmentId, diagnosis, remarks },
      defaults: { appointmentId, diagnosis, remarks },
      transaction: prescriptionTransaction,
    });

    const medicineDetails = await Medicine.bulkCreate(
      medicines.map((medicine) => ({
        ...medicine,
        prescriptionId: prescriptionDetail.id,
      })),
      { transaction: prescriptionTransaction }
    );
    if (created) {
      await Appointment.update(
        { isPrescribed: true },
        { where: { id: appointmentId, isPrescribed: false }, transaction: prescriptionTransaction }
      );
    }

    await prescriptionTransaction.commit();
    res.status(201).json({ prescriptionDetail, medicineDetails });
  } catch (error) {
    res.status(500).json(error);
    await prescriptionTransaction.rollback();
  }
};

export const getPrescription = async (
  req: Request<Record<string, string>, void, void>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const doctorRegistrationId = await Doctor.findOne({ where: { userId } });

    const prescribedAppointmets = await Appointment.findAll({
      where: { doctorId: doctorRegistrationId?.id, isPrescribed: true },
    });
    const appointmentIds = prescribedAppointmets.map((appointment) => appointment.id);
    const prescriptionDetails = await Prescription.findAll({
      where: { appointmentId: { [Op.in]: appointmentIds } },
      include: { model: Medicine, as: "medicineOfPrescription" },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json(prescriptionDetails);
  } catch (error) {
    res.status(500).json(error);
  }
};
