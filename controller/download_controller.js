import path from 'path'
import { fileURLToPath } from 'url'

export const downloader = (req, res) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const filePath = path.join(__dirname,'..', 'files', 'file_1.csv')
  console.log('File path:', filePath) // چاپ مسیر فایل برای بررسی

  res.download(filePath, 'file_1.csv', err => {
    if (err) {
      console.error('Error downloading file:', err)
      res.status(500).send('Error downloading file')
    }
  })
}
