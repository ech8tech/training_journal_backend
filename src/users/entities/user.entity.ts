import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Profile } from "@profiles/entities/profile.entity";
import { UserExercise } from "@users-exercises/entities/user-exercise.entity";

@Entity("Users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 20, unique: true })
  email: string;

  @Column({ length: 100, nullable: true })
  password: string;

  @Column({ length: 20, nullable: true })
  provider: string;

  @Column({ length: 100, nullable: true })
  refreshToken: string;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  profile: Profile;

  @OneToMany(() => UserExercise, (userExercise) => userExercise.user, {
    cascade: true,
  })
  usersExercises: UserExercise[];
}
