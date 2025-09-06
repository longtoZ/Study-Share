class AuthController {
    async verifyUser(req, res) {
        const userId = req.user.user_id;
        const { authorId } = req.query;
        if (authorId && userId !== authorId) {
            return res.status(403).json({ message: 'Forbidden: You are not allowed to perform this action.' });
        }

        res.status(200).json({ message: 'User is verified' });
    }
}

export default new AuthController();
