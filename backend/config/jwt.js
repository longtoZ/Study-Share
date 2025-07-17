import env from 'dotenv'

env.config();

module.export = {
    secret: process.env.JWT_SECRET,
    expiresIn: '1d'
};