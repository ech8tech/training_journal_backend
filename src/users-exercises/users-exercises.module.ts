import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SessionsModule } from "@sessions/sessions.module";
import { SetsModule } from "@sets/sets.module";

import { UserExercise } from "./entities/user-exercise.entity";
import { UsersExercisesController } from "./users-exercises.controller";
import { UsersExercisesService } from "./users-exercises.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserExercise]),
    SessionsModule,
    SetsModule,
  ],
  controllers: [UsersExercisesController],
  providers: [UsersExercisesService],
  exports: [UsersExercisesService],
})
export class UsersExercisesModule {}
