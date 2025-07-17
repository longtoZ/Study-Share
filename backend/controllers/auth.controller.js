import { registerUser } from '../services/user.service.js';

class AuthController {
    async register(req, res) {
        const { username, password, fullName, email, gender, dateOfBirth, address } = req.body;

        const info = {
            userID: username,
            passwordHash: password,
            fullName: fullName,
            email: email,
            gender: gender,
            bio: '',
            profilePictureURL: '',
            dateOfBirth: dateOfBirth,
            address: address
        };

        try {
            const { user, token } = await registerUser(info);
            res.status(201).json({ message: 'User registered successfully', user, token });
        } catch (error) {
            if (error.message.includes('email already exists')) {
                return res.status(409).json({ message: error.message });
            }
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Internal server error during registration.' });
        }
    }

}

export default new AuthController();