import { Request, Response } from "express";



export const createPrescription = async (
    req: Request<Record<string, string>, void, void>,
    res: Response
  ): Promise<void> => {
    try {
      
    } catch (error) {
      res.status(401).json(error);
    }
  };