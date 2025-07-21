import UserService from '../services/user.service.js';

class AuthController {
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
}

export default new AuthController();