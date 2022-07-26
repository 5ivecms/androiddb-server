import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ApplicationVersion } from '../application-version/application-version.entity'
import { FileEnum } from './file.types'

const TABLE_NAME = 'files'

@Entity(TABLE_NAME)
export class FileEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column({ nullable: true })
  public readonly path: string

  @Column()
  public readonly size: string

  @Column({ type: 'enum', enum: FileEnum, default: FileEnum.APK })
  public readonly type: FileEnum

  @Column({ nullable: true })
  public readonly mod: string

  @ManyToOne(() => ApplicationVersion, (applicationVersion) => applicationVersion.files)
  public applicationVersion: ApplicationVersion
}
