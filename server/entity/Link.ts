import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { LinkList } from './LinkList'

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  linkId: number

  @Column()
  linkOrder: number

  @Column()
  url: string

  @Column()
  name: string

  @Column()
  description?: string

  @ManyToOne(
    () => LinkList,
    (linkList) => linkList.listId
  )
  linkList: LinkList
}
