import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

import { createDoctorZodSchema } from "./user.validation";
import { validateRequest } from "../../../middleware/validateRequest";



const router = Router();



router.post("/create-doctor",

    //     (req: Request, res: Response, next: NextFunction) => {

    //     // console.log(req.body, "Be
    //     // fore zod validation");

    //     const parsedResult = createDoctorZodSchema.safeParse(req.body);

    //     if (!parsedResult.success) {
    //         next(parsedResult.error)
    //     }

    //     //sanitizing the data
    //     req.body = parsedResult.data;

    //     next();
    // }

    validateRequest(createDoctorZodSchema)

    , UserController.createDoctor);
// router.post("/create-admin", UserController.createDoctor);
// router.post("/create-superadmin", UserController.createDoctor);

export const UserRoute = router;