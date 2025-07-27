import UserService from '../services/user.service.js';

class UserController {
    async signup(req, res) {
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
            password_hash: password,
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

    async login(req, res) {
        const { email, password } = req.body;

        try {
            const { user, token } = await UserService.loginUser(email, password);
            res.status(200).json({ message: 'Logged in successfully', user, token });
        } catch (error) {
            console.log("Login error:", error);
            res.status(500).json({ message: 'Internal server error during login.'});
        }
    }

    async getUserProfile(req, res) {
        const { userId } = req.params;

        try {
            const user = await UserService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User profile fetched successfully', user });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            res.status(500).json({ message: 'Internal server error while fetching user profile.' });
        }
    }
}

export default new UserController();