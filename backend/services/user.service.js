import User from '../models/User.js';
import { bcrypt } from 'bcrypt';
import { jwt } from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';

class UserService {
    async registerUser(info) {
        const existingUserID = await User.findByID(info.userID);
        if (existingUserID) {
            console.error('User with this userID already exists');
        }

        const existingEmail = await User.findByEmail(info.email);
        if (existingEmail) {
            console.error('User with this email already exists');
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(info.passwordHash, saltRounds);

        info.PasswordHash = passwordHash;
        const newUser = await User.create(info);

        const token = jwt.sign(
            newUser,
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        return { user: newUser, token};
    }
}

module.exports = new UserService();