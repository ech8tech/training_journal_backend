import dayjs from "dayjs";
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

import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { UpdateExerciseDto } from "./dto/update-exercise.dto";

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exercisesRepository: Repository<Exercise>,
    private readonly setsService: SetsService,
    private readonly sessionsService: SessionsService,
  ) {}

  async createExercise(userId: string, createExerciseDto: CreateExerciseDto) {
    try {
      const exercise = await this.exercisesRepository.save({
        name: createExerciseDto.name,
        muscleGroup: createExerciseDto.muscleGroup,
        muscleType: createExerciseDto.muscleType,
        comment: createExerciseDto.comment,
        userId,
      });

      if (!exercise) {
        new BadRequestException("Не удалось создать упражнение");
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

      return exercise;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async editExercise(
    userId: string,
    exerciseId: string,
    updateExerciseDto: UpdateExerciseDto,
  ) {
    // TODO: проблема! если мы удалили с фронта подход, то в таблице он все равно останется
    // TODO: так как его здесь просто не обрабатываем
    const updatedExercise = await this.exercisesRepository.update(
      { id: exerciseId, userId },
      {
        name: updateExerciseDto.name,
        muscleType: updateExerciseDto.muscleType,
        comment: updateExerciseDto.comment,
      },
    );

    if (!updatedExercise) {
      throw new InternalServerErrorException("Не удалось обновить упражнение");
    }

    if (updateExerciseDto?.sets?.length) {
      const sets = updateExerciseDto.sets.map((set) => ({
        ...set,
        userId,
        exerciseId,
      }));

      return await this.setsService.saveSets(sets);
    }
  }

  async getExercises(userId: string) {
    return await this.exercisesRepository.findBy({ userId });
  }

  async getMuscleGroups(userId: string) {
    try {
      const raw = await this.exercisesRepository
        .createQueryBuilder("e")
        .where("e.userId = :userId", { userId })
        .select("e.muscleGroup", "muscleGroup")
        .groupBy("e.muscleGroup")
        .getRawMany<Exercise>();

      if (!raw?.length) {
        return [];
      }

      return raw.map((exercise) => exercise.muscleGroup);
    } catch (e) {
      console.log(e);
    }
  }

  async getExercisesByMuscleGroup(userId: string, muscleGroup: string) {
    const exercises = await this.exercisesRepository.findBy({
      userId,
      muscleGroup,
    });

    const exerciseIds = exercises.map((exercise) => exercise.id);

    const sessions = await this.sessionsService.getSessions(
      userId,
      exerciseIds,
    );

    // упражнения с последними сессиями
    const lastSessionByExercises: Record<string, string | null> = {};
    // упражнения с сегодняшними сессиями
    const todaySessionByExercises: Record<string, boolean> = {};

    for (const session of sessions || []) {
      if (!lastSessionByExercises[session.exerciseId]) {
        lastSessionByExercises[session.exerciseId] = session.id;
      }

      if (session.date === dayjs().format("YYYY-MM-DD")) {
        todaySessionByExercises[session.exerciseId] = true;
      }
    }

    // упражнения с последними сессиями и без СУЩЕСТВУЮЩИХ сессий
    const sessionByExercises = exerciseIds.reduce((acc, exerciseId) => {
      if (lastSessionByExercises[exerciseId]) {
        return acc;
      }
      return { ...acc, [exerciseId]: null };
    }, lastSessionByExercises);

    // упражнения с последними подходами и подходами без назначенных сессий
    const setsByExercises =
      await this.setsService.combineSets(sessionByExercises);

    return exercises.map(({ userId, ...exercise }) => ({
      ...exercise,
      isDone: todaySessionByExercises[exercise.id] || false,
      sessionId: setsByExercises[exercise.id]?.[0]?.sessionId || null,
      sets: setsByExercises[exercise.id]?.map((set) => ({
        id: set.id,
        order: set.order,
        reps: set.reps,
        weight: set.weight,
        sessionId: set.sessionId,
      })),
    }));
  }

  async deleteExercise(userId: string, exerciseId: string) {
    const exercise = await this.exercisesRepository.findOneBy({
      id: exerciseId,
      userId,
    });

    if (!exercise) {
      throw new NotFoundException("Упражнение не найдено");
    }

    return await this.exercisesRepository.remove(exercise);
  }
}
