import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Exercise } from "@exercises/entities/exercise.entity";
import { User } from "@users/entities/user.entity";

@Entity("UsersExercises")
export class UserExercise {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  exerciseId: string;

  @ManyToOne(() => User, (user) => user.usersExercises, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Exercise, (exercise) => exercise.usersExercises, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  exercise: Exercise;
}
