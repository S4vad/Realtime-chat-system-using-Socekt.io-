import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import mongoConnect from "./confilg/mongodb.js";
import User from "./models/user.model.js";
dotenv.config();
import bcrypt from "bcryptjs";
import genToken from "./confilg/token.js";
import isAuth from "./middleware/authMiddleware.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log(req.body);
    let existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "email already exist !" });
    }
    const hashdedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashdedPassword,
    });
    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "signup successfully", data: user });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "password length should be greaterthan 8" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "the password is incorrect" });
    }
    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "login successfully", data: user });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

app.get("/current-user", isAuth, async (req, res) => {

  try {
    const id = req.userId;
    console.log("the backen user id", id);
    const user = await User.findById(id).select("-password");
    return res.status(200).json({ data: user });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

app.get("/get-users", isAuth, async (req, res) => {

  try {

    const users = await User.find().select("-password");
    return res.status(200).json({ data: users });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  mongoConnect();
  console.log(`server port running successfully on port ${PORT}`);
});
