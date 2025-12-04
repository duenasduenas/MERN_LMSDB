import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";

const router = express.Router();

// ---------------- Email/Password Login ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await Student.findOne({ email });
    let role = "student";

    if (!user) {
      user = await Teacher.findOne({ email });
      role = "teacher";
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, name: user.name, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ---------------- Google OAuth Login ----------------
router.get("/google", (req, res) => {
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const redirect_uri = encodeURIComponent(process.env.GOOGLE_REDIRECT_URI); // FIX
  const scope = encodeURIComponent("openid email profile");

  const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&access_type=offline&prompt=consent`;

  res.redirect(url);
});


// ---------------- Google OAuth Callback ----------------
router.get("/google/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { id_token } = tokenRes.data;

    // Decode ID token
    const base64Url = id_token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
    const { email, name } = decoded;

    // Check DB
    let user = await Student.findOne({ email });
    let role = "student";

    if (!user) {
      user = await Teacher.findOne({ email });
      role = "teacher";
    }

    // Create student if not exists
    if (!user) {
      user = await Student.create({ email, name });
    }

    // Issue JWT
    const jwtToken = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/?token=${jwtToken}`);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Google login failed");
  }
});

export default router;
