import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Set } from "@sets/entities/set.entity";
import { UserExercise } from "@users-exercises/entities/user-exercise.entity";

@Entity("Exercises")
export class Exercise {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  muscleGroup: string;

  @OneToMany(() => UserExercise, (userExercise) => userExercise.exercise, {
    cascade: true,
  })
  usersExercises: UserExercise[];

  @OneToMany(() => Set, (set) => set.exercise, {
    cascade: true,
  })
  sets: Set[];
}
