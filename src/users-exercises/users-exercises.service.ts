import { Repository } from "typeorm";

import { Injectable, NotFoundException } from "@nestjs/common";
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

  async removeUserExercise(userId: string, exerciseId: string) {
    const userExercise = await this.usersExerciseRepository.findOneBy({
      userId,
      exerciseId,
    });

    if (!userExercise) {
      throw new NotFoundException("Ошибка удаления упражнения");
    }

    return await this.usersExerciseRepository.remove(userExercise);
  }
}
