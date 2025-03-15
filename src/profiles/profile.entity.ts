import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "@users/user.entity";

@Entity("Profiles")
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 20 })
  name: string;

  @Column()
  age: number;

  @Column()
  weight: number;

  @Column()
  height: number;

  @Column()
  sex: "male" | "female";

  @OneToOne(() => User, (user) => user.profile, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;
}
