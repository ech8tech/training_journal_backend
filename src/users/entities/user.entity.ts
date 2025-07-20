import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Exercise } from "@exercises/entities/exercise.entity";
import { Profile } from "@profiles/entities/profile.entity";

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

  @OneToMany(() => Exercise, (exercise) => exercise.user, {
    cascade: true,
  })
  exercises: Exercise[];
}
