import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';

class AuthMiddleware {
    static verifyUser(req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token, authorization denied.' });
        }

        const token = authHeader.split(' ')[1];
        console.log(token);

        try {
            const decoded = jwt.verify(token, jwtConfig.secret);

            req.user = decoded;

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired.' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token is not valid.' });
            }

            console.error('JWT verification error:', error);
            res.status(500).json({ message: 'Server error during token verification.' });
        }
    }
}

export default AuthMiddleware;