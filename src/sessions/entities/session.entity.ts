import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Set } from "@sets/entities/set.entity";
import { User } from "@users/entities/user.entity";

@Entity("Sessions")
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("date")
  date: string;

  @ManyToOne(() => User, (user) => user.sessions, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => Set, (set) => set.session, {
    cascade: true,
  })
  @JoinColumn()
  sets: Set[];
}
