import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import admin from "firebase-admin";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
connectDB()
    .then(() => console.log("Database connected successfully"))
    .catch((error) => console.error("Database connection failed:", error));
    
// Initializing Firebase Admin SDK
var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);   
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Routing
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("PrepEdge AI Backend"));

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
