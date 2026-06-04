import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { SpecialtyRoutes } from "./app/module/specialty/specialty.route";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import AppError from "./app/errorHelpers/AppError";
import status from "http-status";
import cookieParser from "cookie-parser";

const app: Application = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", IndexRoutes);

// app.get('/', async (req: Request, res: Response) => {
//     // throw new AppError(status.BAD_REQUEST,"Just testing error handler");
//     const specialty = await prisma.specialty.create({
//         data: {
//             title: 'cardiology'
//         }
//     });
//     res.status(201).json({
//         success: true,
//         message: "API is working",
//         data: specialty
//     });
// });

app.get('/', async (req: Request, res: Response) => {
    // throw new AppError(status.BAD_REQUEST,"Just testing error handler");

    res.status(201).json({
        success: true,
        message: "API is working",
    });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;