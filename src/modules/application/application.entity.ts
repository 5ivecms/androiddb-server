import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { CategoryEntity } from '../category/category.entity'
import { Developer } from '../developer/developer.entity'
import { ApplicationVersion } from '../application-version/application-version.entity'
import { Screenshot } from '../screenshot/entities/screenshot.entity'
import { Tag } from '../tag/tag.entity'

@Entity('application')
export class ApplicationEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column()
  public readonly title: string

  @Column()
  public readonly thumb: string

  @Column({ nullable: true })
  public readonly shortDescription: string

  @Column({ nullable: true, default: '' })
  public readonly description: string

  @Column({ nullable: true })
  @Index()
  public readonly pdalifeUrl?: string

  @Column({ nullable: true })
  public readonly googlePlayUrl?: string

  @Column({ nullable: true })
  public readonly lang?: string

  @Column({ default: 0 })
  public readonly parsingStatus: number

  @ManyToOne(() => Developer, (developer) => developer.applications)
  public developer?: Developer

  @ManyToMany(() => CategoryEntity, (category) => category.applications)
  @JoinTable()
  public categories?: CategoryEntity[]

  @ManyToMany(() => Tag, (tag) => tag.applications)
  @JoinTable()
  public tags?: Tag[]

  @ManyToMany(() => Screenshot)
  @JoinTable()
  public screenshots?: Screenshot[]

  @OneToMany(() => ApplicationVersion, (applicationVersion) => applicationVersion.application)
  public applicationVersions: ApplicationVersion[]
}
