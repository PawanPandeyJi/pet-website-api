import { Request, Response } from "express";
import { Prescription, PrescriptionAttributes } from "../models/prescription-model";
import { Medicine, MedicineCreationAttribute } from "../models/medicine-model";
import { Dosage, MedicineDosageCreationAttribute } from "../models/medicineDosage-model";
import { sequelize } from "../utils/db";

export const createPrescription = async (
  req: Request<
    Record<string, string>,
    void,
    PrescriptionAttributes & MedicineCreationAttribute & MedicineDosageCreationAttribute
  >,
  res: Response
): Promise<void> => {
  const prescriptionTransaction = await sequelize.transaction();

  try {
    const {
      diagnosis,
      remarks,
      appointmentId,
      drugName,
      doseTime,
      frequency,
      dose,
      drugForm,
      duration,
    } = req.body;

    const prescriptionExist = await Prescription.findOne({ where: { appointmentId } });

    if (prescriptionExist) {
      res.status(403).json({ message: "Prescription already exist!" });
      return;
    }

    const prescriptionDetail = await Prescription.create(
      {
        diagnosis,
        remarks,
        appointmentId,
      },
      { transaction: prescriptionTransaction }
    );

    const medicineDetail = await Medicine.create(
      {
        drugName,
        prescriptionId: prescriptionDetail.id,
      },
      { transaction: prescriptionTransaction }
    );

    const dosageDetail = await Dosage.create(
      {
        doseTime,
        frequency,
        dose,
        drugForm,
        duration,
        medicineId: medicineDetail.id,
      },
      { transaction: prescriptionTransaction }
    );

    await prescriptionTransaction.commit();
    res.status(201).json({ prescriptionDetail, medicineDetail, dosageDetail });
  } catch (error) {
    res.status(401).json(error);
    await prescriptionTransaction.rollback();
  }
};
