import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm'
import { ApplicationEntity } from '../application/application.entity'

@Entity('category')
@Tree('closure-table')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public title: string

  @TreeChildren()
  public children: CategoryEntity[]

  @TreeParent()
  public parent: CategoryEntity

  @ManyToMany(() => ApplicationEntity, (application) => application.categories)
  public applications: ApplicationEntity[]
}
