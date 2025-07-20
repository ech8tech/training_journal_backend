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
export class SetEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("integer")
  order: number;

  @Column("integer")
  reps: number;

  @Column("decimal")
  weight: number;

  @Column("uuid", { nullable: true })
  sessionId: string | null;

  @Column("uuid")
  userId: string;

  @Column("uuid")
  exerciseId: string;

  @ManyToOne(() => Session, (session) => session.sets, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "sessionId" })
  session: Session | null;

  @ManyToOne(() => Exercise, (exercise) => exercise.sets, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "exerciseId" }])
  exercise: Exercise;
}
