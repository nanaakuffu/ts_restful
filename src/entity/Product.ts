import { IProduct } from "globals/interfaces";
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export default class Product implements IProduct {
  @ObjectIdColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  image_path!: string;

  @Column({ type: "float" })
  price!: number;

  @CreateDateColumn()
  created_at!: Date;

  @Column()
  created_by!: string;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column()
  updated_by!: string;
}
