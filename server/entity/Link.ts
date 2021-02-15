import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { LinkList } from "./LinkList";

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  linkId: number;

  @Column()
  linkOrder: number;

  @Column()
  url: string;

  @Column()
  name: string;

  @Column()
  description?: string;

  @Column()
  readonly listId: number;

  @ManyToOne(() => LinkList, (linkList) => linkList.listId)
  @JoinColumn({ name: "listId" })
  readonly linkList?: LinkList;
}
