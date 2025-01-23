
import User from "../models/users.model.js"
import mongoose from "mongoose";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Registration
export const registration = async (req, res) => {
    try {
        const { firstName, lastName,email, role, password } = req.body;
  
        const user = new User({ firstName, lastName,email, role, password });
        await user.save();
        const token = user.generateAuthToken();
        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = user.generateAuthToken();
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.status(200).json({ message: "User found successfully", status: 200, token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Validate user
const validateUser = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    next();
};

// forget password with nodemailer

export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User with this email does not exist' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'pronobkarmoker1@gmail.com',
            pass: process.env.GMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            to: user.email,
            from: 'pronobkarmoker1@gmail.com',
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   http://${req.headers.host}/reset/${token}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};