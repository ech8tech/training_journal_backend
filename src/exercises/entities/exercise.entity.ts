import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

import { UserExercise } from "@users-exercises/entities/user-exercise.entity";

@Entity("Exercises")
@Unique("UQ_name_muscleGroup_muscleType", ["name", "muscleGroup", "muscleType"])
export class Exercise {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  muscleGroup: string;

  @Column({ nullable: true, length: 255 })
  muscleType: string;

  @OneToMany(() => UserExercise, (userExercise) => userExercise.exercise, {
    cascade: true,
  })
  usersExercises: UserExercise[];
}
