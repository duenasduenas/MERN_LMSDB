// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    console.log("AUTH HEADER:", req.headers.authorization);

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log("No token found");
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("DECODED TOKEN:", decoded); // Should show { id: "...", role: "teacher" }
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT VERIFY ERROR:", error);
        res.status(400).json({ message: "Invalid token" });
    }
};


export default verifyToken;
