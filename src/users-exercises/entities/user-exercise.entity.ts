import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";

import { Exercise } from "@exercises/entities/exercise.entity";
import { Session } from "@sessions/entities/session.entity";
import { Set } from "@sets/entities/set.entity";
import { User } from "@users/entities/user.entity";

@Entity("UsersExercises")
export class UserExercise {
  @PrimaryColumn("uuid")
  userId: string;

  @PrimaryColumn("uuid")
  exerciseId: string;

  @ManyToOne(() => User, (user) => user.usersExercises, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Exercise, (exercise) => exercise.usersExercises, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "exerciseId" })
  exercise: Exercise;

  @OneToMany(() => Set, (set) => set.userExercise, {
    cascade: true,
  })
  sets: Set[];

  @OneToMany(() => Session, (session) => session.userExercise, {
    cascade: true,
  })
  sessions: Session[];
}
