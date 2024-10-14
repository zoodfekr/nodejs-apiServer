import bcryptjs from 'bcryptjs'
import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255
  },

  email: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// استفاده از pre middleware برای هش کردن رمز عبور قبل از ذخیرهسازی
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  try {
    this.password = await bcryptjs.hash(this.password, 10)
    next()
  } catch (error) {
    next(error)
  }
})

//-----------------------------------------------------------
const tokenSchema = mongoose.Schema({
  token: { type: String, require: true },
  username: { type: String, require: true },
  createdAt: { type: Date, default: Date.now, expires: '1h' }
})

//------------------------------------------------------------

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255
  },
  content: { type: String, required: true },
  publishedDate: { type: Date, default: Date.now },
  tags: [String],
  category: { type: String, required: true },
  images: [String],
  views: { type: Number, default: 0 },
  comments: [
    {
      user: String,
      comment: String,
      date: { type: Date, default: Date.now }
    }
  ],
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
})

export const User = mongoose.model('users', userSchema)
export const AuthToken = mongoose.model('AuthToken', tokenSchema)
export const Posts = mongoose.model('posts', postSchema)
