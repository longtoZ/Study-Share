import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import userService from '../services/user.service.js';

export default function configurePassport() {
    passport.use(new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('Google profile:', profile);

            // Create a user object based on Google profile data
            const randomPassword = Math.random().toString(36).slice(-8); // Generate a random password
            const info = {
                user_id: `google_${profile.id}`,
                email: profile.emails?.[0]?.value,
                full_name: profile.displayName || 'No Name',
                gender: 'prefer_not_to_say',
                bio: 'This is a Google OAuth user.',
                profile_picture_url: profile.photos?.[0]?.value || '',
                background_image_url: '',
                password: randomPassword,
                created_date: new Date().toISOString(),
                last_login: new Date().toISOString(),
                is_admin: false,
                auth_provider: profile.provider,
                provider_id: profile.id
            }

            const { user } = await userService.signupUser(info, info.auth_provider);
            console.log('User signed up via Google OAuth:', user);

            // Login the user to create a jwt token
            const { user: loggedInUser, token } = await userService.loginUser(info.email, randomPassword, info.auth_provider);
            console.log('User logged in via Google OAuth:', loggedInUser);

            info.token = token; // Attach token to user info for session
            done(null, info);
        } catch (error) {
            done(null, false, { message: error.message });  // Pass error message to failureRedirect
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });
}