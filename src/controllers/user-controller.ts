import { Request, Response } from "express";
import { Pet, PetCreationAttribute } from "../models/pet-model";
import path from "path";
import fs from "fs";
import mime from "mime";
import { User } from "../models/user-register-model";
import { Doctor } from "../models/doctor-model";
import { DoctorShedule } from "../models/doctor-shedule-model";
export const petRegistration = async (
  req: Request<Record<string, string>, void, PetCreationAttribute>,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(409).json({ message: "No logged in user found" });
      return;
    }
    const userId = req.user.id;
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    const image = req.file.filename;
    const { petName, age, breed, weight, type, gender, color } = req.body;
    const pet = await Pet.create({
      petName,
      age,
      breed,
      weight,
      type,
      gender,
      color,
      image,
      userId,
    });

    res.status(201).json({ pet });
  } catch (error) {
    res.status(401).json(error);
  }
};

export const gettingPetDetails = async (
  req: Request<Record<string, string>, void, PetCreationAttribute>,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(409).json({ message: "No logged in user found" });
      return;
    }
    const userId = req.user.id;

    const allPets = await Pet.findAll({
      where: {
        userId: userId,
        isDeleted: false,
      },
    });

    const pets = allPets.map((pet) => {
      pet.image = getImage(pet.image);
      return pet;
    });

    res.status(200).json(pets);
  } catch (error) {
    res.status(401).json(error);
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

export const deletePet = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(409).json({ message: "No logged in user found" });
      return;
    }
    const userId = req.user.id;
    const authorizedUser = await User.findOne({ where: { id: userId } });
    if (!authorizedUser) {
      res.status(401).json({ message: "Unauthrized user!" });
      return;
    }
    const petId = req.params.id;
    await Pet.update({ isDeleted: true }, { where: { userId, id: petId, isDeleted: false } });
    res.status(200).json({ message: "Pet deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error!", error });
  }
};

export const getDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctors = await Doctor.findAll({
      include: [
        { model: DoctorShedule, as: "DoctorShedule" },
        { model: User, as: "userAsDoctor" },
      ],
    });
    const profileImages = doctors.map((image) => {
      image.profileImage = getImage(image.profileImage);
      return image;
    });
    res.status(200).json(profileImages);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!", error });
  }
};
