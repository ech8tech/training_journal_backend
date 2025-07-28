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

  @Get("all")
  @UseGuards(JwtAuthGuard)
  getMuscleGroups(@CurrentUser() user: User) {
    return this.exercisesService.getExercises(user.id);
  }

  @Get("muscle_group/:muscleGroup")
  @UseGuards(JwtAuthGuard)
  getByMuscleGroup(
    @CurrentUser() user: User,
    @Param("muscleGroup") muscleGroup: string,
  ) {
    return this.exercisesService.getExercisesByMuscleGroup(
      user.id,
      muscleGroup,
    );
  }

  @Post("create")
  @UseGuards(JwtAuthGuard)
  createExercise(
    @CurrentUser() user: User,
    @Body() createExerciseDto: CreateExerciseDto,
  ) {
    return this.exercisesService.createExercise(user.id, createExerciseDto);
  }

  @Patch("edit/:exerciseId")
  @UseGuards(JwtAuthGuard)
  updateExercise(
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
