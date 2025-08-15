import express, { json } from 'express';
import cors from 'cors';
import authRoutes from './routes/user.route.js';
import materialRoutes from './routes/material.route.js';
import subjectRoutes from './routes/subject.route.js';
import lessonRoutes from './routes/lesson.route.js';
import commentRoutes from './routes/comment.route.js';

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
app.use('/api/comment', commentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});