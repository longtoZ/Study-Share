import express, { json } from 'express';
import session from 'express-session';
import cors from 'cors';
import env from 'dotenv';
import passport from 'passport';

import configurePassport from './config/passport.config.js';
import userRoutes from './routes/user.route.js';
import materialRoutes from './routes/material.route.js';
import subjectRoutes from './routes/subject.route.js';
import lessonRoutes from './routes/lesson.route.js';
import commentRoutes from './routes/comment.route.js';
import authRoutes from './routes/auth.route.js';    
import ratingRoutes from './routes/rating.route.js';
import historyRoutes from './routes/history.route.js';
import paymentRoutes from './routes/payment.route.js';
import statisticsRoutes from './routes/statistics.route.js';
import aiChatRoutes from './routes/ai-chat.route.js';
import googleOAuthRoutes from './routes/google-oauth.route.js';
import taskRoutes from './routes/task.route.js';

env.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true
}));
app.use(json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('Welcome to StudyShare API!');
});

app.use('/api/user', userRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/subject', subjectRoutes);
app.use('/api/lesson', lessonRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/ai-chat', aiChatRoutes);
app.use('/auth', googleOAuthRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
    console.log('process.env.FRONTEND_ORIGIN:', process.env.FRONTEND_ORIGIN);
    console.log('process.env.BACKEND_ORIGIN:', process.env.BACKEND_ORIGIN);
    console.log(`Server is running on port ${PORT}`);
});