import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./db/connectDB.js";
import userRouter from "./route/user.route.js";
const app = express();
import dotenv from 'dotenv';
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Database connection
connectDB();
// Routes
app.use('/api/v1', userRouter);
// Example route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Add your routes here

export default app;