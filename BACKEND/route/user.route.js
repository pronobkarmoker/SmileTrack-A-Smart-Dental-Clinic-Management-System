import express from 'express';
import mongoose from 'mongoose';
import { login, registration } from '../controllers/user.controller';

const router = express.Router();

// Define your routes here
router.post('/register', registration);
router.get('/login', login)

// Export the router
export default router;