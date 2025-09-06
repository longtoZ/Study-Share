import { Router } from 'express';
import multer from 'multer';
import UserController from '../controllers/user.controller.js';
import AuthMiddleware from '../middleware/auth.middleware.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.get('/exists', UserController.checkEmailExists);
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.get('/:userId', UserController.getUserProfile);
router.put('/:authorId', AuthMiddleware.verifyUser, upload.fields([
    { name: 'profile_picture_file', maxCount: 1 },
    { name: 'background_image_file', maxCount: 1 }
]), UserController.updateUserProfile);
router.delete('/:userId', AuthMiddleware.verifyUser, UserController.deleteUser);
router.post('/login/google', UserController.googleLogin);

export default router;