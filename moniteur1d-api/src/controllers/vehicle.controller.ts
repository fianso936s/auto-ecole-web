import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { z } from "zod";

const vehicleSchema = z.object({
  name: z.string().min(2),
  plateNumber: z.string().min(5),
  transmission: z.enum(["MANUAL", "AUTO"]),
  isActive: z.boolean().optional(),
});

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des véhicules" });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const data = vehicleSchema.parse(req.body);

    const vehicle = await prisma.vehicle.create({
      data: {
        name: data.name,
        plateNumber: data.plateNumber,
        transmission: data.transmission,
        isActive: data.isActive ?? true,
      }
    });

    res.status(201).json(vehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Erreur lors de la création du véhicule" });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateSchema = vehicleSchema.partial();

  try {
    const data = updateSchema.parse(req.body);
    
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data,
    });

    res.json(vehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Erreur lors de la mise à jour du véhicule" });
  }
};

export const toggleVehicleActive = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: { isActive },
    });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du changement de statut" });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.vehicle.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du véhicule" });
  }
};

