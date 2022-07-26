import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ApplicationEntity } from '../application/application.entity'

@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public title: string

  @ManyToMany(() => ApplicationEntity, (applications) => applications.tags)
  public applications: ApplicationEntity[]
}
