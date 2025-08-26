class AuthController {
    async verifyUser(req, res) {
        res.status(200).json({ message: 'User is verified' });
    }
}

export default new AuthController();
