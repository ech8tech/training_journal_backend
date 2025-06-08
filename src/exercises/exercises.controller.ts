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

import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { UpdateExerciseDto } from "./dto/update-exercise.dto";
import { ExercisesService } from "./exercises.service";

@Controller("exercises")
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post("create")
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: User,
    @Body() createExerciseDto: CreateExerciseDto,
  ) {
    return this.exercisesService.create({
      ...createExerciseDto,
      userId: user?.id,
    });
  }

  @Get()
  findAll() {
    return this.exercisesService.findAll();
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exercisesService.update(id, updateExerciseDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.exercisesService.remove(id);
  }

  @Delete()
  removeAll() {
    return this.exercisesService.removeAll();
  }
}
