import { Router, type IRouter } from "express";
import healthRouter from "./health";
import plantIdentifyRouter from "./plant-identify";
import plantKnowledgeRouter from "./plant-knowledge";

const router: IRouter = Router();

router.use(healthRouter);
router.use(plantIdentifyRouter);
router.use(plantKnowledgeRouter);

export default router;
