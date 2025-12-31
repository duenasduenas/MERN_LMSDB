import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.18.5:5173",
  "https://unoffending-shelley-swingingly.ngrok-free.dev"
]

const app = express();
const server = http.createServer(app); // ✅ ONE server

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});


// ✅ Socket listeners
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("join-subject", (subjectId) => {
    socket.join(subjectId);
    console.log(`📘 ${socket.id} joined subject room ${subjectId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});


// middleware
// app.use(cors());

// ✅ Replace your current app.use(cors()) with this:
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/subject", subjectRoutes);
app.use("/api/auth", authRoutes);

connectDB();

const PORT = process.env.PORT || 5001;

// ❗ IMPORTANT: listen on server, NOT app
server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});

export { io };
