import { Request, Response } from "express";
import status from "http-status";

export const notFound = (req: Request, res: Response) => {
    res.status(status.NOT_FOUND).json({
        sucess: false,
        message: `Route ${req.originalUrl} Not Found`,
    })
}