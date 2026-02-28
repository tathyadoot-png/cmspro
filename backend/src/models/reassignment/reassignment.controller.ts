import { Request, Response } from "express";
import reassignmentService from "./reassignment.service";

export const autoReassign = async (
    req: Request,
    res: Response
) => {
    try {

        if (!req.user)
            return res.status(401).json({ success: false });

        const task =
            await reassignmentService.autoReassign(
                req.params.id as string,
                req.user
            );

        res.json({
            success: true,
            data: task,
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};