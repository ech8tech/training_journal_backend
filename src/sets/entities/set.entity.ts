import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Session } from "@sessions/entities/session.entity";
import { UserExercise } from "@users-exercises/entities/user-exercise.entity";

@Entity("Sets")
export class Set {
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

  @ManyToOne(() => UserExercise, (userExercise) => userExercise.sets, {
    onDelete: "CASCADE",
  })
  @JoinColumn([
    { name: "userId", referencedColumnName: "userId" },
    { name: "exerciseId", referencedColumnName: "exerciseId" },
  ])
  userExercise: UserExercise;
}
