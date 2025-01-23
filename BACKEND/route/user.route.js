import express from 'express';
import mongoose from 'mongoose';
import { login, registration } from '../controllers/user.controller.js';

const router = express.Router();

// Define your routes here
router.post('/auth/register', registration);
router.get('/auth/login', login)

// Export the router
export default router;