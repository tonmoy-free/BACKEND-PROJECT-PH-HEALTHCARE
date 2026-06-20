import { NextFunction, Request, Response, Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { CookieUtils } from "../../utils/cookie";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../../middleware/checkAuth";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../../middleware/validateRequest";
import { SpecialtyValidation } from "./specialty.validation";

const router = Router();

router.post('/',
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"),
    validateRequest(SpecialtyValidation.createSpecialtyZodSchema),
    SpecialtyController.createSpecialty);

router.get('/', SpecialtyController.getAllSpecialies);

router.delete('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialtyController.deleteSpecialty);

export const SpecialtyRoutes = router;