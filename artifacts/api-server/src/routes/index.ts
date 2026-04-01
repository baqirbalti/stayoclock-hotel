import { Router, type IRouter } from "express";
import healthRouter from "./health";
import roomsRouter from "./rooms";
import bookingsRouter from "./bookings";
import diningRouter from "./dining";
import settingsRouter from "./settings";
import aiRouter from "./ai";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(roomsRouter);
router.use(bookingsRouter);
router.use(diningRouter);
router.use(settingsRouter);
router.use(aiRouter);
router.use(storageRouter);

export default router;
