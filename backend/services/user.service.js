import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';

class UserService {
    async signupUser(info) {
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

        info.passwordHash = passwordHash;
        const newUser = await User.create(info);

        // const token = jwt.sign(
        //     newUser,
        //     jwtConfig.secret,
        //     { expiresIn: jwtConfig.expiresIn }
        // );

        const userWithoutPasswordHash = { ... newUser};
        delete userWithoutPasswordHash.PasswordHash;
        return { user: userWithoutPasswordHash };
    }

    async loginUser(email, password) {
        const user = await User.findByEmail(email);
        if (!user) {
            throw new Error("Email doesn't exist.");
        }

        const isPasswordCorrect = bcrypt.compare(password, user.PasswordHash);
        if (!isPasswordCorrect) {
            throw new Error('Password is not correct.');
        }

        const token = jwt.sign(
            { userID: user.UserID, email: user.Email},
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        const userWithoutPasswordHash = { ...user };
        delete userWithoutPasswordHash.PasswordHash;
        return { user: userWithoutPasswordHash, token };
    }
}

export default new UserService();