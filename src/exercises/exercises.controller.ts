import { CurrentUser } from "@auth/decorators";
import { JwtAuthGuard } from "@auth/guards";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { User } from "@users/entities/user.entity";
import { UsersExercisesService } from "@users-exercises/users-exercises.service";

import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { UpdateExerciseDto } from "./dto/update-exercise.dto";
import { ExercisesService } from "./exercises.service";

@Controller("exercise")
export class ExercisesController {
  constructor(
    private readonly exercisesService: ExercisesService,
    private readonly usersExerciseService: UsersExercisesService,
  ) {}

  @Get("all/:muscleGroup")
  @UseGuards(JwtAuthGuard)
  findAll(
    @CurrentUser() user: User,
    @Param("muscleGroup") muscleGroup: string,
  ) {
    return this.usersExerciseService.getUserExercises(user.id, muscleGroup);
  }

  @Post("create")
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: User,
    @Body() createExerciseDto: CreateExerciseDto,
  ) {
    return this.exercisesService.createExercise(user.id, createExerciseDto);
  }

  @Patch("edit/:exerciseId")
  @UseGuards(JwtAuthGuard)
  update(
    @CurrentUser() user: User,
    @Param("exerciseId") exerciseId: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exercisesService.editExercise(
      user.id,
      exerciseId,
      updateExerciseDto,
    );
  }

  @Delete("delete/:exerciseId")
  @UseGuards(JwtAuthGuard)
  delete(@CurrentUser() user: User, @Param("exerciseId") exerciseId: string) {
    return this.usersExerciseService.deleteUserExercise(user.id, exerciseId);
  }

  @Delete()
  removeAll() {
    return this.exercisesService.removeAll();
  }
}
