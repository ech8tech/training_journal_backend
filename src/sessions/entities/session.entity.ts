import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Exercise } from "@exercises/entities/exercise.entity";
import { SetEntity } from "@sets/entities/set.entity";

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

  @OneToMany(() => SetEntity, (set) => set.session, {
    cascade: true,
  })
  @JoinColumn()
  sets: SetEntity[];

  @ManyToOne(() => Exercise, (exercise) => exercise.sets, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "exerciseId" }])
  exercise: Exercise;
}
