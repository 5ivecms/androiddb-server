import { AfterLoad, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column()
  public readonly type: string

  @Column()
  public readonly name: string
}
