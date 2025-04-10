import { config } from 'dotenv'

config()

export const { PORT, MONGODB_URI, NODE_ENV, JWT_SECRET, EMAIL_USER, EMAIL_PASSWORD } = process.env;