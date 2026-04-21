import express from 'express';
import { validateRequest } from '../../../shared/index.js';
import { loginSchema } from '../validations/auth.schema.js';
import { login } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', validateRequest(loginSchema), login);

export { router as authRoutes };
