import express, { json } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import materialRoutes from './routes/material.route.js';
import subjectRoutes from './routes/subject.route.js';
import lessonRoutes from './routes/lesson.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true
}));

app.use(json());

app.get('/', (req, res) => {
    res.send('Welcome to StudyShare API!');
});

app.use('/api/auth', authRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/subject', subjectRoutes);
app.use('/api/lesson', lessonRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});