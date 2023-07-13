import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";
import { IUser, IUserInfo } from "../globals/interfaces";

@Entity()
export class User implements IUserInfo {
  @ObjectIdColumn()
  _id!: string;

  @PrimaryColumn()
  id!: string;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column()
  password!: string;

  @Column({ type: "uniqueidentifier" })
  email!: string;

  @Column({ length: 10 })
  contact_number!: string;

  @Column({ type: "int", length: 1 })
  role_id!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
