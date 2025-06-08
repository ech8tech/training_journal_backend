import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Set } from "@sets/entities/set.entity";
import { UserExercise } from "@users-exercises/entities/user-exercise.entity";

@Entity("Sessions")
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("date")
  date: string;

  @Column("uuid")
  userId: string;

  @Column("uuid")
  exerciseId: string;

  @OneToMany(() => Set, (set) => set.session, {
    cascade: true,
  })
  @JoinColumn()
  sets: Set[];

  @ManyToOne(() => UserExercise, (userExercise) => userExercise.sets, {
    onDelete: "CASCADE",
  })
  @JoinColumn([
    { name: "userId", referencedColumnName: "userId" },
    { name: "exerciseId", referencedColumnName: "exerciseId" },
  ])
  userExercise: UserExercise;
}
