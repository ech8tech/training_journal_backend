import { Controller } from "@nestjs/common";

import { UsersExercisesService } from "./users-exercises.service";

@Controller("users-exercises")
export class UsersExercisesController {
  constructor(private readonly usersExercisesService: UsersExercisesService) {}
}
