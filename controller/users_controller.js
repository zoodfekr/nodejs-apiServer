import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AuthToken, User } from '../model/users_model.js'

// ثبت نام کاربر
export const user_register = async (req, res) => {
  const { username, password, email } = req.body

  try {
    const findedUser = await User.findOne({ username })
    if (findedUser) {
      return res.status(409).json({ message: 'نام کاربری موجود است' }) // 409 Conflict
    }

    const hash = await bcryptjs.hash(password, 10)
    const user = new User({ username, password: hash, email })
    const savedUser = await user.save()

    console.log(savedUser)
    res.status(201).json({ message: 'ثبت نام با موفقیت انجام شد' }) // 201 Created
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'خطایی رخ داده است' })
  }
}

// ورود و دریافت توکن توسط کاربر
export const user_login = async (req, res) => {
  const { username, password } = req.body
  try {
    const findedUser = await User.findOne({ username })
    if (!findedUser) {
      return res
        .status(401)
        .json({ message: 'نام کاربری یا رمز عبور اشتباه است' }) // 401 Unauthorized
    }

    const isMatch = await bcryptjs.compare(password, findedUser.password)
    if (!isMatch) {
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
          res.status(500).json({ error: 'Error generating token' })
        } else {
          // حذف توکنهای قبلی کاربر
          await AuthToken.deleteMany({ username: findedUser.username })
          // ذخیره توکن جدید در پایگاه داده
          const newToken = new AuthToken({
            token,
            username: findedUser.username
          })
          await newToken.save()
          res.json({ username: findedUser.username, token })
        }
      }
    )
  } catch (error) {
    console.log('مشلکل در ورود', error)
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

    // بررسی اعتبار توکن
    const tokenData = await AuthToken.findOne({ token: bearerToken,})
    if (!tokenData) {
      return res.status(403).json({ message: 'توکن نامعتبر است' }) // Forbidden
    }
    next()
  } else {
    res.status(403).json({ message: 'توکن مورد نیاز است' }) // Forbidden
  }
}
