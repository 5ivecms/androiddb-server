import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ApplicationEntity } from '../application/application.entity'

const TABLE_NAME = 'developers'

@Entity(TABLE_NAME)
export class Developer {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column()
  @Index({ unique: true })
  public readonly name: string

  @OneToMany(() => ApplicationEntity, (application) => application.developer)
  public applications: ApplicationEntity[]
}
