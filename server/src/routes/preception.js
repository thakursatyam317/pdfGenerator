import express from "express";
import { createBeautifulPDF } from "../controllers/preception.js";

const router = express.Router();

router.post("/createPDF", createBeautifulPDF);

export default router;
