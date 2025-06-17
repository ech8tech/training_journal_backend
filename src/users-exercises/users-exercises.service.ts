import { groupBy } from "lodash";
import { Repository } from "typeorm";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session } from "@sessions/entities/session.entity";
import { SessionsService } from "@sessions/sessions.service";
import { SetsService } from "@sets/sets.service";
import { UserExercise } from "@users-exercises/entities/user-exercise.entity";

import { CreateUsersExerciseDto } from "./dto/create-users-exercise.dto";

@Injectable()
export class UsersExercisesService {
  constructor(
    @InjectRepository(UserExercise)
    private readonly usersExerciseRepository: Repository<UserExercise>,
    private readonly sessionsService: SessionsService,
    private readonly setsService: SetsService,
  ) {}

  createUserExercise(createUsersExerciseDto: CreateUsersExerciseDto) {
    return this.usersExerciseRepository.save(createUsersExerciseDto);
  }

  async getUserExercises(userId: string, muscleGroup: string) {
    const usersExercises = await this.usersExerciseRepository.find({
      where: { userId, exercise: { muscleGroup } },
      relations: ["exercise"],
    });

    const exercises = usersExercises.map(({ exercise }) => exercise);
    const exIds = exercises.map((exercise) => exercise.id);

    const sessionsFound = await this.sessionsService.getSessions(userId, exIds);

    // коллекция из последних сессий по дате
    const lastSessionByEx = new Map<string, Session>();
    for (const s of sessionsFound) {
      if (!lastSessionByEx.has(s.exerciseId)) {
        lastSessionByEx.set(s.exerciseId, s);
      }
    }

    // exerciseIds по найденным сессиям
    const exIdsInSessions = lastSessionByEx.keys();

    const setsFound = await this.setsService.getSetsBatch({
      exerciseIds: exIds,
    });

    const setsGroup = groupBy(setsFound, (x) => x.exerciseId);

    return exercises.map((exercise) => ({
      ...exercise,
      sets: setsGroup[exercise.id]?.map((set) => ({
        order: set.order,
        reps: set.reps,
        weight: set.weight,
      })),
    }));
  }

  async deleteUserExercise(userId: string, exerciseId: string) {
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
