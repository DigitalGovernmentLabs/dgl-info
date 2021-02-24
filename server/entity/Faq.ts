import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { FaqGroup } from "./FaqGroup";

@Entity()
export class Faq {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FaqGroup, (faqGroup) => faqGroup.faqList)
  group: FaqGroup;

  @Column({ type: "text", default: "" })
  question: string;

  @Column({ type: "text", default: "" })
  answer: string;

  @Column("simple-array")
  keywords: string[];

  @CreateDateColumn()
  createDate: Date | null;

  @Column({ type: "date", nullable: true, default: null })
  updateDate: Date | null;

  @DeleteDateColumn()
  deleteDate: Date | null;
}
