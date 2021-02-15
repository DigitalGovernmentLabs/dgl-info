import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsAlphanumeric, MinLength } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128, unique: true })
  @MinLength(2)
  @IsAlphanumeric()
  name: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ length: 256, select: false })
  passwordHash: string;
}
