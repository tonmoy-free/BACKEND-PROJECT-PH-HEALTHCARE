import { NextFunction, Request, Response } from "express";
import { envVars } from "../app/config/env";
import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../app/interfaces/error.interface";
import { handleZodError } from "../app/errorHelpers/handleZodError";
import AppError from "../app/errorHelpers/AppError";
import { deleteFileFromCloudinary } from "../app/config/cloudinary.config";




export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === 'development') {
        console.log("Error from Global Error Handler", err);
    }

    if (req.file) {
        await deleteFileFromCloudinary(req.file.path)
    }

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const imageUrls = req.files.map((file) => file.path);
        await Promise.all(imageUrls.map(url => deleteFileFromCloudinary(url)));
    }

    let errorSources: TErrorSources[] = []
    let statusCode: number = status.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal server Error'
    let stack: string | undefined = undefined

    if (err instanceof z.ZodError) {
        const simplifiedError = handleZodError(err)
        statusCode = simplifiedError.statusCode as number;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources]

    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        stack = err.stack;
        errorSources = [
            {
                path: ``,
                message: err.message
            }
        ]

    } else if (err instanceof Error) {
        statusCode = status.INTERNAL_SERVER_ERROR;
        message = err.message;
        stack = err.stack;
        errorSources = [
            {
                path: ``,
                message: err.message
            }
        ]

        const errorResponse: TErrorResponse = {
            statusCode,
            success: false,
            message: message,
            errorSources,
            stack: envVars.NODE_ENV === 'development' ? stack : undefined,
            error: envVars.NODE_ENV === 'development' ? err : undefined,
        }

        // res.status(500).json(errorResponse)
    }
    // রেসপন্সটি কন্ডিশনের বাইরে নিয়ে আসুন যেন সব ধরনের এরর রেসপন্স পায়
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        errorSources,
        stack: envVars.NODE_ENV === 'development' ? stack : undefined,
        // error: envVars.NODE_ENV === 'development' ? err : undefined, // ঐচ্ছিক
    });
}



