import { Repository } from "typeorm";

import { Exercise } from "@exercises/entities/exercise.entity";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
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

  async createExercise(userId: string, createExerciseDto: CreateExerciseDto) {
    try {
      const exercise = await this.exercisesRepository.save({
        name: createExerciseDto.name,
        muscleGroup: createExerciseDto.muscleGroup,
        muscleType: createExerciseDto.muscleType,
      });

      if (!exercise) {
        new BadRequestException("Не удалось создать упражнение");
      }

      const usersExercises =
        await this.usersExercisesService.createUserExercise({
          userId,
          exerciseId: exercise.id,
        });

      if (!usersExercises) {
        new BadRequestException("Не удалось связать упражнение");
      }

      if (createExerciseDto?.sets?.length) {
        const sets = createExerciseDto.sets.map((set) => ({
          ...set,
          userId,
          exerciseId: exercise.id,
          sessionId: null,
        }));

        await this.setsService.saveSets(sets);
      }

      return usersExercises;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async editExercise(
    userId: string,
    exerciseId: string,
    updateExerciseDto: UpdateExerciseDto,
  ) {
    const sessionFounded = await this.sessionsService.getSession(
      userId,
      exerciseId,
      updateExerciseDto.date,
    );

    if (sessionFounded?.id) {
      // const sets = await this.setsService.getSets(sessionFounded.id);
      const sets = sessionFounded?.sets;

      if (sets?.length) {
        return await this.setsService.saveSets(updateExerciseDto.sets);
      } else {
        throw new NotFoundException("Подходы по этой сессии не найдены");
      }
    } else {
      const setsUnassigned = await this.setsService.getUnassignedSets(
        userId,
        exerciseId,
      );

      if (setsUnassigned?.length) {
        return await this.setsService.saveSets(updateExerciseDto.sets);
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
