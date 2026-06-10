import { Router, type IRouter } from "express";
import healthRouter from "./health";
import plantIdentifyRouter from "./plant-identify";
import plantKnowledgeRouter from "./plant-knowledge";
import plantHealthRouter from "./plant-health";
import privacyRouter from "./privacy";

const router: IRouter = Router();

router.use(healthRouter);
router.use(plantIdentifyRouter);
router.use(plantKnowledgeRouter);
router.use(plantHealthRouter);
router.use(privacyRouter);

export default router;
