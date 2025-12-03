import express from "express";
import preRoutes from "./src/routes/preception.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/prescription", preRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});