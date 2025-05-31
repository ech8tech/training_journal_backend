import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateUsersExerciseDto } from "./dto/create-users-exercise.dto";
import { UpdateUsersExerciseDto } from "./dto/update-users-exercise.dto";
import { UsersExercisesService } from "./users-exercises.service";

@Controller("users-exercises")
export class UsersExercisesController {
  constructor(private readonly usersExercisesService: UsersExercisesService) {}

  @Post()
  create(@Body() createUsersExerciseDto: CreateUsersExerciseDto) {
    return this.usersExercisesService.create(createUsersExerciseDto);
  }

  @Get()
  findAll() {
    return this.usersExercisesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersExercisesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateUsersExerciseDto: UpdateUsersExerciseDto,
  ) {
    return this.usersExercisesService.update(+id, updateUsersExerciseDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersExercisesService.remove(+id);
  }
}
