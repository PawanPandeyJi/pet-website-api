import { Request, Response } from "express";
import { Prescription, PrescriptionAttributes } from "../models/prescription-model";
import { Medicine, MedicineCreationAttribute } from "../models/medicine-model";
import { sequelize } from "../utils/db";

export const createPrescription = async (
  req: Request<Record<string, string>, void, PrescriptionAttributes & {medicine: MedicineCreationAttribute[]}>,
  res: Response
): Promise<void> => {
  const prescriptionTransaction = await sequelize.transaction();

  try {
    const {
      diagnosis,
      remarks,
      appointmentId,
      medicine
    } = req.body;

    const [prescriptionDetail, created] = await Prescription.findOrCreate({
      where: { appointmentId, diagnosis, remarks },
      defaults: { appointmentId, diagnosis, remarks },
      transaction: prescriptionTransaction,
    });

    const medicineDetails = await Medicine.bulkCreate(
        medicine.map(medicine => ({
          ...medicine, 
          prescriptionId: prescriptionDetail.id, 
        })),
        { transaction: prescriptionTransaction }
      );
  

    await prescriptionTransaction.commit();
    res.status(201).json({ prescriptionDetail, medicineDetails });
  } catch (error) {
    res.status(401).json(error);
    await prescriptionTransaction.rollback();
  }
};
