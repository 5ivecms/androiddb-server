import { DataSource } from 'typeorm'
import { Role } from './role.entity'

export const rolesLoader = async (configService: any) => {
  const dataSource = new DataSource({
    name: 'default',
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: ['dist/**/*.entity.{ts,js}'],
  })

  await dataSource.initialize()

  const roleRepository = dataSource.getRepository(Role)
  const role = roleRepository.create({ name: 'Администратор', type: 'administrator' })
  await roleRepository.save(role)
}
