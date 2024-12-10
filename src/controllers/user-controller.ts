import { Request, Response } from "express";
import { Pet, PetCreationAttribute } from "../models/pet-model";

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
    const { petName, age, breed, weight, type, gender, color, image } = req.body;
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
    res.status(500).json({ message: "Internal server error!", error });
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
      },
    });

    res.status(200).json(allPets);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!", error });
  }
};
