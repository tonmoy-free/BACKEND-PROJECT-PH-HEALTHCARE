import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { SpecialtyRoutes } from "./app/module/specialty/specialty.route";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import AppError from "./app/errorHelpers/AppError";
import status from "http-status";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "node:path";
import { envVars } from "./app/config/env";
import cors from "cors";
import qs from "qs";

const app: Application = express();
//qa pnpm for queryBuilder
app.set("query parser", (str: string) => qs.parse(str));

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));

app.use(cors({
    origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL, "http://localhost:3000", "http://localhost:5000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use("/api/auth", toNodeHandler(auth))

// Enable URL-encoded form data parsing
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