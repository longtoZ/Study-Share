import express from 'express';
import passport from 'passport';
import env from 'dotenv';
env.config();

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: `/auth/error` }), (req, res) => {
    // Successful authentication, redirect home.
    res.redirect(`${process.env.FRONTEND_ORIGIN}/redirect-to-home?user_id=${req.user.user_id}&token=${req.user.token}`);
});

router.get('/error', (req, res) => {
    const errorMsg = req.session?.messages?.[0] || 'Authentication failed';
    res.redirect(`${process.env.FRONTEND_ORIGIN}/login?error=${encodeURIComponent(errorMsg)}`);
});

export default router;