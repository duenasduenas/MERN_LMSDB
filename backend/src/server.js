import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import studentRoutes from './routes/studentRoutes.js'
import teacherRoutes from './routes/teacherRoutes.js'
import subjectRoutes from './routes/subjectRoutes.js'
import authRoutes from './routes/authRoutes.js'

import {connectDB} from './config/db.js'



dotenv.config();

const app = express();

// middleware
app.use(cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
  
app.use(express.json())
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/subject', subjectRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;

connectDB();

app.listen(5001,() => {
    console.log('Server Started',PORT)
})