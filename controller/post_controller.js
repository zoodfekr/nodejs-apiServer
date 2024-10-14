import { log } from 'console'
import { Posts } from '../model/users_model.js'

export const posts_data = async (req, res) => {
  const {
    title,
    content,
    author,
    publishedDate,
    tags,
    category,
    images,
    views,
    comments,
    status
  } = req.body

  try {
    const post = new Posts({
      title,
      content,
      author,
      publishedDate,
      tags,
      category,
      images,
      views,
      comments,
      status
    })

    const saved_post = await post.save()
    res.json({ message: 'پست با موفقیت ذخیره شد', post: saved_post })
  } catch (error) {
    res.status(500).json({ message: 'خطایی رخ داده است', error })
  }
}

export const get_posts_data = async (req, res) => {
  try {
    let finded_posts = await Posts.find()
    let data = finded_posts.map(val => val)
    res.status(200).json({ message: data })
  } catch (error) {
    res.status(500).json({ message: 'خطایی رخ داده است', error })
  }
}

export const del_posts_data = async (req, res) => {
  try {
    const { id } = req.params
    const post = await Posts.findByIdAndDelete(id)
    if (!post) {
      return res.status(404).json({ message: 'پست مورد نظر یافت نشد' })
    }
    res.json({ message: 'پست با موفقیت حذف شد' })
  } catch (error) {
    res.status(500).json({ message: 'خطایی رخ داده است' })
  }
}
