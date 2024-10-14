import path from 'path'
import { fileURLToPath } from 'url'

export const downloader = (req, res) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  let filename =
    'A.Beautiful.Mind.2001.1080P.Bluray.Dubbed.Hardtsub.Zarfilm.mp4'

  const filePath = path.join(__dirname, '..', 'files', filename)
  console.log('File path:', filePath) // چاپ مسیر فایل برای بررسی

  res.download(filePath, filename, err => {
    if (err) {
      console.error('Error downloading file:', err)
      res.status(500).send('Error downloading file')
    }
  })
}
