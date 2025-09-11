import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import env from 'dotenv';
import EmailJobManager from '../utils/deleteUnverifiedAccount.js';
import PasswordResetJobManager from '../utils/verifyPasswordReset.js';
import EmailService from '../utils/sendEmail.js';

env.config();

class UserService {
    constructor() {
        this.jobManager = new EmailJobManager();
        this.passwordResetJobManager = new PasswordResetJobManager();
        this.emailService = new EmailService();
    }

    async signupUser(info, auth_provider = 'regular') {
        const existinguser_id = await User.findByID(info.user_id);
        if (existinguser_id) {
            throw new Error('User with this user_id already exists');
        }

        const existingEmail = await User.findByEmail(info.email, auth_provider);
        if (existingEmail) {
            throw new Error('User with this email already exists');
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(info.password, saltRounds);
        delete info.password;

        info.password_hash = passwordHash;
        const newUser = await User.create(info);

        const userWithoutPasswordHash = { ... newUser};
        delete userWithoutPasswordHash.password_hash;

        // Send verification email
        await this.emailService.sendEmail(newUser.email, newUser.verification_code, 'email_verification');

        // Start the job to delete unverified account
        this.jobManager.startJob(newUser.email);

        return { user: userWithoutPasswordHash };
    }

    async verifyEmail(email, code) {
        const user = await User.verifyEmail(email, code);

        if (!user) {
            throw new Error('Email verification code is incorrect or has expired.');
        }
        // Stop the job to delete unverified account
        this.jobManager.stopJob(user.email);
        return user;
    }

    async loginUser(email, password, auth_provider = 'regular') {
        console.log('Login attempt with email:', email, password);
        const user = await User.findByEmail(email , auth_provider);
        console.log('User found:', user);
        if (!user) {
            throw new Error("email doesn't exist.");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordCorrect) {
            throw new Error('Password is not correct.');
        }

        const token = jwt.sign(
            { user_id: user.user_id, email: user.email},
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        const userWithoutPasswordHash = { ...user };
        delete userWithoutPasswordHash.password_hash;
        return { user: userWithoutPasswordHash, token };
    }

    async getUserById(userId, requireEmail = false) {
        const user = await User.findByID(userId, requireEmail);
        if (!user) {
            throw new Error('Failed to fetch user data');
        }
        return user;
    }

    async updateUserInfo(user_id, updates) {
        const user = await User.findByID(user_id);
        if (!user) {
            throw new Error('User not found');
        }

        const metadata = updates.metadata;
        const profilePictureFile = updates.profilePictureFile;
        const backgroundImageFile = updates.backgroundImageFile;

        await User.updateImage(metadata, profilePictureFile, backgroundImageFile);
        await User.updateInfo(user_id, metadata);
    }

    async deleteUser(user_id, password) {
        const user = await User.findByID(user_id);
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordCorrect) {
            throw new Error('Password is not correct.');
        }

        await User.delete(user_id);
    }

    async notifyResetPassword(user_id) {
        const user = await User.findByID(user_id, true);
        if (!user) {
            throw new Error('User not found');
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        await User.updateInfo(user_id, { verification_code: verificationCode });

        // Send password reset email
        await this.emailService.sendEmail(user.email, verificationCode, 'password_reset');

        // Start the job to clear the password reset code
        this.passwordResetJobManager.startJob(user_id);
    }

    async verifyResetPassword(user_id, code, newPassword) {
        const user = await User.findByID(user_id, false, true);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.verification_code !== code) {
            throw new Error('Password reset code is incorrect or has expired.');
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);
        await User.updateInfo(user_id, { password_hash: passwordHash, verification_code: null });

        // Stop the job to clear the password reset code
        this.passwordResetJobManager.stopJob(user_id);
    }
}

export default new UserService();