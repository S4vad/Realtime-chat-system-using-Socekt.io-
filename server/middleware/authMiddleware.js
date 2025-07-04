import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(400).json({ message: "Token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT Verification Failed:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default isAuth;
