import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ApplicationEntity } from '../application/application.entity'
import { FileEntity } from '../file/file.entity'

const TABLE_NAME = 'application_version'

@Entity(TABLE_NAME)
@Index(['version', 'applicationId'], { unique: true })
export class ApplicationVersion {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column({ nullable: true })
  public readonly description?: string

  @Column({ nullable: true })
  public readonly changes?: string

  @Column({ nullable: true })
  public readonly version?: string

  @Column({ nullable: true })
  public readonly androidVersion?: string

  @Column({ nullable: true })
  public readonly internet?: string

  @Column({ nullable: true })
  public readonly multiplayer?: string

  @Column({ nullable: true })
  public readonly diskSpace?: string

  @Column()
  public readonly applicationId: number

  @ManyToOne(() => ApplicationEntity, (application) => application.applicationVersions)
  public application: ApplicationEntity

  @OneToMany(() => FileEntity, (file) => file.applicationVersion)
  public files: FileEntity[]
}
