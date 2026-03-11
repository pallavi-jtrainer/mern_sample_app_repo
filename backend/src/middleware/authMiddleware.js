import jwt from "jsonwebtoken";
import BlacklistedToken from "../models/BlackListedToken.js";

export default async function (req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  const blacklisted = await BlacklistedToken.findOne({ token });

  if (blacklisted) {
    return res.status(401).json({
      message: "Token has been logged out",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
}
