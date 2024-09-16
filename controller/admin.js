import { AuthToken, User } from '../model/users_model.js'

export const get_users = async (req, res) => {
  try {
    const users = await User.find()
    let users_data = users.map(val => ({
      id: val._id,
      username: val.username,
      email: val.email
    }))
    res.status(200).json({ message: users_data })
  } catch (error) {
    res.status(500).json({ message: 'خطایی رخ داده است' })
  }
}


