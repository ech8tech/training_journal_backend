import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { CreateUsersExerciseDto } from "./dto/create-users-exercise.dto";
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
    return this.usersExercisesService.findByUserId(id);
  }
}
