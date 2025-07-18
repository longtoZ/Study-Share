import env from 'dotenv'

env.config();

const config = {
    secret: process.env.JWT_SECRET,
    expiresIn: '1d'
}

export default config;