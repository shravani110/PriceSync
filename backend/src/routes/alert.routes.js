import { Router } from "express";
import { listAlerts, setAlert, clearAlert } from "../controllers/alert.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", listAlerts);
router.post("/", setAlert);
router.delete("/:productId", clearAlert);

export default router;
