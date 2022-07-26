import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { rolesLoader } from './modules/role/roles-loader'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)

  app.setGlobalPrefix('api')
  app.enableCors()

  await app.listen(configService.get('server.port'))

  await rolesLoader(configService)
}
bootstrap()
