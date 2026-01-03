import express from "express";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/summarize", upload.single("file"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));
    formData.append("query", req.body.query);

    const response = await axios.post(
      "http://localhost:8001/rag-summarize",
      formData,
      { headers: formData.getHeaders() }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Summarization failed" });
  }
});

export default router;
