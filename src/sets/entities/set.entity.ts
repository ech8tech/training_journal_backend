import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Exercise } from "@exercises/entities/exercise.entity";
import { Session } from "@sessions/entities/session.entity";

@Entity("Sets")
export class Set {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Session, (session) => session.sets, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  session: Session;

  @ManyToOne(() => Exercise, (exercise) => exercise.sets, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  exercise: Exercise;

  @Column("integer")
  order: number;

  @Column("integer")
  reps: number;

  @Column("decimal")
  weight: number;
}
