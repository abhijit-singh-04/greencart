import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User : api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Please Provide the Details",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "User Already Exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, // Prevent Javascript to access cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in Production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF Protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
    });

    return res.status(201).json({
      success: true,
      message: "Signup Successful",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.log("Error in api/user/register API : ", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Register User : api/user/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return (
        res
          // .status(500)
          .json({ success: false, message: "Email or Password is missing" })
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return (
        res
          // .status(404)
          .json({ success: false, message: "Invalid email or password" })
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return (
        res
          // .status(400)
          .json({ success: false, message: "Password doesn't match" })
      );
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User Logged In Succesfully",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.log("Error in api/user/login API : ", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Check Auth : api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById({ _id: userId }).select("-password");
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in api/user/is-auth API : ", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Logout User : api/user/logout

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged Out!!",
    });
  } catch (error) {
    console.log("Error in api/user/logout API : ", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
