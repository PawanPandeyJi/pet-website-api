import { Request, response, Response } from "express";
import { Doctor, DoctorCreationAttribute } from "../models/doctor-model";
import { DoctorShedule, DoctorSheduleCreationAttribute } from "../models/doctor-shedule-model";
import { sequelize } from "../utils/db";
import path from "path";
import fs from "fs";
import mime from "mime";

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
      availableTimeFrom,
      availableTimeTo,
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
        availableTimeFrom,
        availableTimeTo,
        doctorId: doctorDetail.id,
      },
      { transaction: tx }
    );

    await tx.commit();
    res.status(201).json({ doctorDetail, doctorSchedule });
  } catch (error) {
    await tx.rollback();
    res.status(500).json(error);
    console.log(error);
  }
};

export const getDoctorDetails = async (req: Request, res: Response) => {
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

    if (!registeredDoctor) {
      res.status(401).json({ message: "Doctor not found!" });
      return;
    }

    const doctorWithImages = {
      ...registeredDoctor.toJSON(),
      profileImage: getImage(registeredDoctor.profileImage),
      certificateImage: getImage(registeredDoctor.certificateImage),
    };

    res.status(200).json(doctorWithImages);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getImage = (key: string): string => {
  try {
    const buf = fs.readFileSync(path.join("images", key));
    const mimeType = mime.lookup(key);
    return `data:${mimeType};base64,${buf.toString("base64")}`;
  } catch (error) {
    if ((error as { code: string }).code === "ENOENT") {
      return "";
    }
    throw error;
  }
};
