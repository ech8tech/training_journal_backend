import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Session } from "@sessions/entities/session.entity";
import { SetEntity } from "@sets/entities/set.entity";
import { User } from "@users/entities/user.entity";

@Entity("Exercises")
export class Exercise {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  muscleGroup: string;

  @Column({ nullable: true, length: 255 })
  muscleType: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.exercises, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany(() => SetEntity, (set) => set.exercise, {
    cascade: true,
  })
  sets: SetEntity[];

  @OneToMany(() => Session, (session) => session.exercise, {
    cascade: true,
  })
  sessions: Session[];
}
