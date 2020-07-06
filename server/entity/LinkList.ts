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

  /* eslint-disable */
  @OneToMany(
    (type) => Link,
    (link) => link.linkList
  )
  links: Link | null[]
  /* eslint-enable */
}
