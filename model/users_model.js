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

const tokenSchema = mongoose.Schema({
  token: { type: String, require: true },
  username: { type: String, require: true },
  createdAt: { type: Date, default: Date.now, expires: '1h' }
})

export const User = mongoose.model('users', userSchema)
export const AuthToken = mongoose.model('AuthToken', tokenSchema)
