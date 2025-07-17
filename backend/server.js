import express, { json } from 'express';
import dbPool from './config/database.js';
import authRoutes from './routes/auth.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

app.get('/', (req, res) => {
    res.send('Welcome to StudyShare API!');
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});