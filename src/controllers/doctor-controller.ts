import { Request, Response } from "express";
import { Doctor, DoctorCreationAttribute } from "../models/doctor-model";
import { DoctorShedule, DoctorSheduleCreationAttribute } from "../models/doctor-shedule-model";
import { sequelize } from "../utils/db";

export const registerDoctor = async (
  req: Request<
    Record<string, string>,
    void,
    DoctorCreationAttribute & DoctorSheduleCreationAttribute
  >,
  res: Response
) => {
    const tx = await sequelize.transaction();

  try {
    if (!req.user) {
      res.status(409).json({ message: "No logged in user found" });
      return;
    }
    const userId = req.user.id;
    if(!req.file) {
        res.status(400).json("No file uploaded!")
        return
    }
    const profileImage = req.file.filename
    const certificateImage = req.file.filename
    const {
      dob,
      gender,
      phone,
      qualification,
      specialization,
      licenseNumber,
      address,
      availableDays,
      availableTime,
    } = req.body;

    const doctorDetail = await Doctor.create({dob,
        gender,
        phone,
        qualification,
        specialization,
        licenseNumber,
        address,
        profileImage,
        certificateImage,userId},{transaction:tx});
    const doctorSchedule = await DoctorShedule.create({
      availableDays,
      availableTime,
      doctorId: doctorDetail.id,
    },{transaction:tx});

    await tx.commit()
    res.status(201).json({ doctorDetail, doctorSchedule });
  } catch (error) {
    res.status(500).json({ message: "Intrnal server error", error });
    await tx.rollback();

  }
};
