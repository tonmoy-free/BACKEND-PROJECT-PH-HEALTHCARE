import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get("/", DoctorController.getAllDoctors);
// router.get("/:id", DoctorController.getAllDoctorById);
// router.put("/:id", DoctorController.updsatedoctor);
// router.patch("/:id", DoctorController.updsatedoctor);
// router.delete("/:id", DoctorController.updsatedoctor);



export const DoctorRoutes = router;