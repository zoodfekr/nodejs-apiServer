import express from 'express'
import jwt from 'jsonwebtoken'

import { get_users } from '../controller/admin.js'
import {
  user_login,
  user_logout,
  user_register,
  verifyToken
} from '../controller/users_controller.js'
import {
  del_posts_data,
  get_posts_data,
  posts_data
} from '../controller/post_controller.js'
import { downloader } from '../controller/download_controller.js'

const router = express.Router()

// users
router.post('/login', user_login)
router.post('/user_register', verifyToken, user_register)
router.post('/logout', verifyToken, user_logout)

// home
router.get('/users', verifyToken, get_users)

//add post
router.post('/post', verifyToken, posts_data)
router.get('/posts', verifyToken, get_posts_data)
router.delete('/posts/:id', verifyToken, del_posts_data)

// download
router.get('/download', downloader)

// هندلر صفحه 404
router.use((req, res, next) => res.json('لینک مورد نظر یافت نشد'))

export default router
