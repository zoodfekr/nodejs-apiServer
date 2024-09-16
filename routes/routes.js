import express from 'express'
import jwt from 'jsonwebtoken'

import { get_users } from '../controller/admin.js'
import { user_login, user_register, verifyToken } from '../controller/users_controller.js'

const router = express.Router()

// home
router.get('/users',verifyToken, get_users)

// users
router.post('/user_register', user_register)
router.post('/login', user_login)

// هندلر صفحه 404
router.use((req, res, next) => res.json('لینک مورد نظر یافت نشد'))

export default router
