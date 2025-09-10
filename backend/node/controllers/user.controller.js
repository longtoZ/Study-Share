import User from '../models/user.model.js';
import UserService from '../services/user.service.js';

class UserController {
    static async signup(req, res) {
        const { username, password, full_name, email, gender, dateOfBirth, address } = req.body;

        const info = {
            user_id: username,           
            email: email,               
            full_name: full_name,
            gender: gender,
            bio: '',
            profile_picture_url: '',
            date_of_birth: dateOfBirth,
            address: address,
            password: password,
            created_date: new Date(),
            last_login: null,
            is_admin: false
        };

        console.log(info)

        try {
            const { user } = await UserService.signupUser(info);
            res.status(201).json({ message: 'User signed up successfully', user });
        } catch (error) {
            if (error.message.includes('email already exists')) {
                return res.status(409).json({ message: error.message });
            }
            console.error('Sign up error:', error);
            res.status(500).json({ message: 'Internal server error during signing up.' });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;

        try {
            const { user, token } = await UserService.loginUser(email, password);
            res.status(200).json({ message: 'Logged in successfully', user, token });
        } catch (error) {
            if (error.message.includes('Password is not correct')) {
                return res.status(401).json({ message: error.message });
            } else if (error.message.includes("This email is registered via")) {
                return res.status(400).json({ message: error.message });
            }
            
            res.status(500).json({ message: 'Internal server error during login.' });
        }
    }

    static async getUserProfile(req, res) {
        const { userId } = req.params;
        const requireEmail = req.query['require-email'];

        try {
            const user = await UserService.getUserById(userId, requireEmail === 'true');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User profile fetched successfully', user });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            res.status(500).json({ message: 'Internal server error while fetching user profile.' });
        }
    }
    
    static async updateUserProfile(req, res) {
        const { authorId } = req.params;
        const userId = req.user.user_id;

        if (userId !== authorId) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own profile.' });
        }

        const profilePictureFile = req.files.length > 0 ? req.files.profile_picture_file[0] : null;
        const backgroundImageFile = req.files.length > 0 ? req.files.background_image_file[0] : null;

        try {
            await UserService.updateUserInfo(authorId, {
                metadata: JSON.parse(req.body.metadata),
                profilePictureFile,
                backgroundImageFile
            });
            res.status(200).json({ message: 'User profile updated successfully' });
        } catch (error) {
            console.error('Error updating user profile:', error);
            res.status(500).json({ message: 'Internal server error while updating user profile.' });
        }
    }

    static async deleteUser(req, res) {
        const { authorId } = req.params;
        const userId = req.user.user_id;
        const { password } = req.body;

        if (userId !== authorId) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own account.' });
        }

        try {
            await UserService.deleteUser(authorId, password);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            if (error.message.includes('Password is not correct')) {
                return res.status(401).json({ message: error.message });
            }
            console.error('Error deleting user:', error);
            res.status(500).json({ message: 'Internal server error while deleting user.' });
        }
    }

    static async checkEmailExists(req, res) {
        const { email } = req.query;

        try {
            const exists = await User.findByEmail(email);
            res.status(200).json({ exists: !!exists });
        } catch (error) {
            console.error('Error checking email existence:', error);
            res.status(500).json({ message: 'Internal server error while checking email existence.' });
        }
    }

    static async googleLogin(req, res) {
        const { token } = req.body;

        try {
            const { user, jwtToken } = await UserService.googleLogin(token);
            res.status(200).json({ message: 'Logged in with Google successfully', user, token: jwtToken });
        } catch (error) {
            console.error('Google login error:', error);
            res.status(500).json({ message: 'Internal server error during Google login.' });
        }
    }

    static async verifyEmail(req, res) {
        const { email, code } = req.body;

        try {
            const user = await User.verifyEmail(email, code);
            res.status(200).json({ message: 'Email verified successfully', user });
        } catch (error) {
            console.error('Error verifying email:', error);
            res.status(500).json({ message: 'Internal server error while verifying email.' });
        }
    }
}

export default UserController;