import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 128 })
  name: string

  @Column({ default: false })
  isAdmin: boolean

  @Column({ length: 256 })
  passwordHash: string
}
