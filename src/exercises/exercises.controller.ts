import { CurrentUser } from "@auth/decorators";
import { JwtAuthGuard } from "@auth/guards";
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { User } from "@users/entities/user.entity";

import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { UpdateExerciseDto } from "./dto/update-exercise.dto";
import { ExercisesService } from "./exercises.service";

@Controller("exercise")
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get("all/:muscleGroup")
  @UseGuards(JwtAuthGuard)
  findAll(
    @CurrentUser() user: User,
    @Param("muscleGroup") muscleGroup: string,
  ) {
    return this.exercisesService.getExercises(user.id, muscleGroup);
  }

  @Get("exerciseId")
  @UseGuards(JwtAuthGuard)
  find(@CurrentUser() user: User, @Param("exerciseId") exerciseId: string) {
    return this.exercisesService.getExercise(user.id, exerciseId);
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

  // @Delete("delete/:exerciseId")
  // @UseGuards(JwtAuthGuard)
  // delete(@CurrentUser() user: User, @Param("exerciseId") exerciseId: string) {
  //   return this.exercisesService.deleteExercise(user.id, exerciseId);
  // }
}
