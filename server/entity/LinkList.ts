import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Link } from './Link'

@Entity()
export class LinkList {
  @PrimaryGeneratedColumn()
  listId: number

  @Column()
  listOrder: number

  @Column({ length: 100 })
  listTitle: string

  @OneToMany(
    () => Link,
    (link) => link.linkList
  )
  links?: Link[]
}
