import { Request, response, Response } from "express";
import { Doctor, DoctorCreationAttribute } from "../models/doctor-model";
import { DoctorShedule, DoctorSheduleCreationAttribute } from "../models/doctor-shedule-model";
import { sequelize } from "../utils/db";

interface MulterFiles {
  profileImage?: Express.Multer.File[];
  certificateImage?: Express.Multer.File[];
}

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
    const files = req.files as MulterFiles;
    if (!files.profileImage || !files.certificateImage) {
      res.status(400).json("No file uploaded!");
      return;
    }
    const profileImage = files.profileImage[0].filename;
    const certificateImage = files.certificateImage[0].filename;
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

    const doctorDetail = await Doctor.create(
      {
        dob,
        gender,
        phone,
        qualification,
        specialization,
        licenseNumber,
        address,
        profileImage,
        certificateImage,
        userId,
      },
      { transaction: tx }
    );
    const doctorSchedule = await DoctorShedule.create(
      {
        availableDays,
        availableTime,
        doctorId: doctorDetail.id,
      },
      { transaction: tx }
    );

    await tx.commit();
    res.status(201).json({});
  } catch (error) {
    await tx.rollback();
    res.status(500).json(error);
    console.log(error);
  }
};

export const registerDoctorDetails = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(409).json({ message: "No logged in user found" });
      return;
    }
    const userId = req.user.id;
    const registeredDoctor = await Doctor.findOne({
      where: { userId },
      include: [{ model: DoctorShedule, as: "DoctorShedule" }],
    });
    res.status(200).json(registeredDoctor);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
