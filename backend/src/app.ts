import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import petRoutes from './routes/petRoutes.js';
import vaccinationRoutes from './routes/vaccinationRoutes.js';
import medicationRoutes from './routes/medicationRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import careTipRoutes from './routes/careTipRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/care-tips', careTipRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', vaccinationRoutes);
app.use('/api', medicationRoutes);
app.use('/api', activityRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
