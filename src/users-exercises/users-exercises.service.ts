import { Injectable } from "@nestjs/common";

import { CreateUsersExerciseDto } from "./dto/create-users-exercise.dto";
import { UpdateUsersExerciseDto } from "./dto/update-users-exercise.dto";

@Injectable()
export class UsersExercisesService {
  create(createUsersExerciseDto: CreateUsersExerciseDto) {
    return "This action adds a new usersExercise";
  }

  findAll() {
    return `This action returns all usersExercises`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersExercise`;
  }

  update(id: number, updateUsersExerciseDto: UpdateUsersExerciseDto) {
    return `This action updates a #${id} usersExercise`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersExercise`;
  }
}
