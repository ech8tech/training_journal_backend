import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserExercise } from "@users-exercises/entities/user-exercise.entity";

import { CreateUsersExerciseDto } from "./dto/create-users-exercise.dto";

@Injectable()
export class UsersExercisesService {
  constructor(
    @InjectRepository(UserExercise)
    private readonly usersExerciseRepository: Repository<UserExercise>,
  ) {}

  create(createUsersExerciseDto: CreateUsersExerciseDto) {
    return this.usersExerciseRepository.save(createUsersExerciseDto);
  }

  findAll() {
    return this.usersExerciseRepository.find();
  }

  findByUserId(userId: string) {
    return this.usersExerciseRepository.findBy({ userId });
  }

  remove(id: number) {
    return this.usersExerciseRepository.delete(id);
  }
}
