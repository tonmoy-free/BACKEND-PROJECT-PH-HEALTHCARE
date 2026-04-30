import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import status from "http-status";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === 'development') {
        console.log("Error from Global Error Handler", err);
    }

    let statusCode: number = status.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal server Error'

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message,
    })
}