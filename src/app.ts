import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { SpecialtyRoutes } from "./app/module/specialty/specialty.route";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";

const app: Application = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/v1", IndexRoutes);

app.get('/', async (req: Request, res: Response) => {
    const specialty = await prisma.specialty.create({
        data: {
            title: 'cardiology'
        }
    });
    res.status(201).json({
        success: true,
        message: "API is working",
        data: specialty
    });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;