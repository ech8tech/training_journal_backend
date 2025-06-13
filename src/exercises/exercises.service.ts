import { Repository } from "typeorm";

import { Exercise } from "@exercises/entities/exercise.entity";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SessionsService } from "@sessions/sessions.service";
import { SetsService } from "@sets/sets.service";
import { UsersService } from "@users/users.service";
import { UsersExercisesService } from "@users-exercises/users-exercises.service";

import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { UpdateExerciseDto } from "./dto/update-exercise.dto";

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exercisesRepository: Repository<Exercise>,
    private readonly usersExercisesService: UsersExercisesService,
    private readonly usersService: UsersService,
    private readonly setsService: SetsService,
    private readonly sessionsService: SessionsService,
  ) {}

  async createExercise(createExerciseDto: CreateExerciseDto) {
    const foundUser = await this.usersService.find({
      id: createExerciseDto.userId,
    });

    if (!foundUser?.id) {
      throw new BadRequestException("Не найден пользователь");
    }

    const exercise = await this.exercisesRepository.save({
      name: createExerciseDto.name,
      muscleGroup: createExerciseDto.muscleGroup,
    });

    if (!exercise) {
      throw new BadRequestException("Не удалось создать упражнение");
    }

    const usersExercises = await this.usersExercisesService.create({
      userId: foundUser.id,
      exerciseId: exercise.id,
    });

    if (!usersExercises) {
      throw new BadRequestException("Не удалось связать упражнение");
    }

    if (createExerciseDto?.sets?.length) {
      const sets = createExerciseDto.sets.map((set) => ({
        ...set,
        userId: foundUser.id,
        exerciseId: exercise.id,
        sessionId: null,
      }));

      return await this.setsService.addSets(sets);
    }

    throw new BadRequestException("Не удалось установить подходы к упражнению");
  }

  async findAll() {
    return await this.exercisesRepository.find();
  }

  async editExercise(
    userId: string,
    exerciseId: string,
    updateExerciseDto: UpdateExerciseDto,
  ) {
    const sessionFounded = await this.sessionsService.findSession(
      userId,
      exerciseId,
      updateExerciseDto.date,
    );

    if (sessionFounded?.id) {
      const sets = await this.setsService.findSetsBySessionId(
        sessionFounded.id,
      );

      if (sets?.length) {
        return await this.setsService.addSets(updateExerciseDto.sets);
      } else {
        throw new BadRequestException("Подходы по этой сессии не найдены");
      }
    } else {
      const setsUnassigned = await this.setsService.findSetsWithoutSessions(
        userId,
        exerciseId,
      );

      console.log(setsUnassigned);

      if (setsUnassigned?.length) {
        return await this.setsService.addSets(updateExerciseDto.sets);
      } else {
        throw new BadRequestException("Подходы по этому упражнению не найдены");
      }
    }
  }

  async remove(id: string) {
    return await this.exercisesRepository.delete(id);
  }

  async removeAll() {
    await this.exercisesRepository.delete({});
  }
}
