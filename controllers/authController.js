import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import crypto from 'crypto';
import { sendVerificationEmail } from "../services/emailService.js";

export const register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    let accountNumber;
    let isUnique = false;

    while (!isUnique) {
      accountNumber = Math.floor(100000 + Math.random() * 900000).toString();
      const existingAccountNumber = await User.findOne({ accountNumber });
      if (!existingAccountNumber) {
        isUnique = true;
      }
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = new User({
      username,
      password,
      email,
      accountNumber,
      verificationToken,
    });
    await user.save();

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      message: "User registered successfully. Please check your email to verify your account.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        accountNumber: user.accountNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};


export const updateUserAddress = async (req, res) => {
  const { street, townCity, county, postCode } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.street = street || user.street;
    user.townCity = townCity || user.townCity;
    user.county = county || user.county;
    user.postCode = postCode || user.postCode;
    await user.save();
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating address", error: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email before logging in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        accountNumber: user.accountNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log('User:', req.user);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error changing password", error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user details", error: error.message });
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying email", error: error.message });
  }
};