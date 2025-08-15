import { Router } from 'express';
import multer from 'multer';
import UserController from '../controllers/user.controller.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.get('/user/:userId', UserController.getUserProfile);
router.put('/user/:userId', upload.fields([
    { name: 'profile_picture_file', maxCount: 1 },
    { name: 'background_image_file', maxCount: 1 }
]), UserController.updateUserProfile);


export default router;