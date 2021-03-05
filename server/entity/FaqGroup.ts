import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Faq } from "./Faq";

/**
 * FAQ のグループ
 *
 * - 並び替えが可能。数が少ないのを前提に、すべての order を更新して並び替え。
 */
@Entity()
export class FaqGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: "text", default: "" })
  description: string;

  @OneToMany(() => Faq, (faq) => faq.group)
  faqList: Faq[];

  @Column()
  @Index()
  order: number;

  @Column({ default: () => "NOW()" })
  lastListUpdateDate: Date;
}
