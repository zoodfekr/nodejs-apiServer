import express from 'express'
import http from 'http'
import dotenv from 'dotenv'
import process from 'process'
import path from 'path'
import { fileURLToPath } from 'url'
import morgan from 'morgan'
import debug from 'debug'
const log = debug('backend')

import router from './routes/routes.js'
import { connectDB } from './config/db.js'
import { logger } from './config/winston.js'

const app = express()
const server = http.createServer(app)

// Load environment variables
dotenv.config({ path: './config/config.env' })

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Use morgan for logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined', { stream: logger.stream }))
}

// for use json data
app.use(express.json())

// Serve static files
app.use(express.static(path.join(__dirname, 'public')))

// Use routes
app.use(router)

// Connect to the database
connectDB()
log('Connected to database')

// Start the server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
