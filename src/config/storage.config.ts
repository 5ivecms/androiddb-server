import { registerAs } from '@nestjs/config'

export default registerAs('storage', () => ({
  uploadsFolder: process.env.UPLOADS_FOLDER,
  screenshotsFolder: process.env.SCREENSHOTS_FOLDER,
}))
