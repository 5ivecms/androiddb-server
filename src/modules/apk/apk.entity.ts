import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('apk')
export class Apk {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column()
  public readonly label: string

  @Column({ nullable: true })
  public readonly mod: string

  @Column({ nullable: true })
  public readonly path: string

  @Column()
  public readonly size: string
}
