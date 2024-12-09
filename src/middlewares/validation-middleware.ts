import { Request, Response, NextFunction } from "express";
import z from "zod";

export const validateUserData =
  (Schema: z.ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await Schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(401).json({ message: error.errors[0].message });
      } else {
        res.status(500).json("Internal server error");
      }
    }
  };
