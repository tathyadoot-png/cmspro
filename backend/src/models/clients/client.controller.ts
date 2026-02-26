import { Request, Response } from "express";
import clientService from "./client.service";

export const createClient = async (req: Request, res: Response) => {
  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const client = await clientService.createClient(
      req.body,
      req.user
    );

    res.status(201).json({ success: true, data: client });

  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getClients = async (req: Request, res: Response) => {
  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const clients = await clientService.getClients(req.user);

    res.json({ success: true, data: clients });

  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};