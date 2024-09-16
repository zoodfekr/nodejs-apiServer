import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import debug from 'debug'
const log = debug('backend')

import { AuthToken, User } from '../model/users_model.js'

// ثبت نام کاربر
export const user_register = async (req, res) => {
  const { username, password, email } = req.body

  try {
    const findedUser = await User.findOne({ username })
    if (findedUser) {
      log('User already exists: %O', findedUser)
      return res.status(409).json({ message: 'نام کاربری موجود است' }) // 409 Conflict
    }

    const user = new User({ username, password, email })
    const savedUser = await user.save()

    log('User registered successfully: %O', savedUser)
    res.status(201).json({ message: 'ثبت نام با موفقیت انجام شد' }) // 201 Created
  } catch (error) {
    log('Error during registration: %O', error)
    res.status(500).json({ message: 'خطایی رخ داده است' })
  }
}

// ورود و دریافت توکن توسط کاربر
export const user_login = async (req, res) => {
  const { username, password } = req.body
  try {
    const findedUser = await User.findOne({ username })
    if (!findedUser) {
      log('User not found: %O', username)
      return res
        .status(401)
        .json({ message: 'نام کاربری یا رمز عبور اشتباه است' }) // 401 Unauthorized
    }

    const isMatch = await bcryptjs.compare(password, findedUser.password)
    if (!isMatch) {
      log('Password mismatch for user: %O', username)
      return res
        .status(401)
        .json({ message: 'نام کاربری یا رمز عبور اشتباه است' }) // 401 Unauthorized
    }

    jwt.sign(
      { username: findedUser.username },
      'secretkey',
      { expiresIn: '1h' },
      async (err, token) => {
        if (err) {
          log('Error generating token: %O', err)
          res.status(500).json({ error: 'Error generating token' })
        } else {
          await AuthToken.deleteMany({ username: findedUser.username })
          const newToken = new AuthToken({
            token,
            username: findedUser.username
          })
          await newToken.save()
          log('User logged in and token generated: %O', findedUser.username)
          res.json({ username: findedUser.username, token })
        }
      }
    )
  } catch (error) {
    log('Error during login: %O', error)
    res.status(500).json({ message: 'خطایی رخ داده است' })
  }
}

// اعتبارسنجی توکن
export const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers['authorization']
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken

    const tokenData = await AuthToken.findOne({ token: bearerToken })
    if (!tokenData) {
      log('Invalid token: %O', bearerToken)
      return res.status(403).json({ message: 'توکن نامعتبر است' }) // Forbidden
    }
    log('Token verified: %O', bearerToken)
    next()
  } else {
    log('Token required but not provided')
    res.status(403).json({ message: 'توکن مورد نیاز است' }) // Forbidden
  }
}

// خروج کاربر
export const user_logout = async (req, res) => {
  try {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]

      await AuthToken.deleteMany({ token: bearerToken })
      log('User logged out and token deleted: %O', bearerToken)
      res.status(200).json({ message: 'توکن شما حذف شد' })
    } else {
      log('Token required but not provided for logout')
      res.status(403).json({ message: 'توکن مورد نیاز است' }) // Forbidden
    }
  } catch (error) {
    log('Error during logout: %O', error)
    res.status(500).json({ message: 'خطایی رخ داده است' })
  }
}
