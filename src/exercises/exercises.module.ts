import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SessionsModule } from "@sessions/sessions.module";
import { SetsModule } from "@sets/sets.module";
import { UsersModule } from "@users/users.module";
import { UsersExercisesModule } from "@users-exercises/users-exercises.module";

import { Exercise } from "./entities/exercise.entity";
import { ExercisesController } from "./exercises.controller";
import { ExercisesService } from "./exercises.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Exercise]),
    UsersExercisesModule,
    SetsModule,
    UsersModule,
    SessionsModule,
  ],
  controllers: [ExercisesController],
  providers: [ExercisesService],
})
export class ExercisesModule {}
