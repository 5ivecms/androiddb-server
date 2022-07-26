import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('screenshot')
export class Screenshot {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public url: string
}
