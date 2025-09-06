import { SaveSetDto } from "src/sets/dto/save-set.dto";
import { In, IsNull, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SetEntity } from "@sets/entities/set.entity";

@Injectable()
export class SetsService {
  constructor(
    @InjectRepository(SetEntity)
    private readonly setsRepository: Repository<SetEntity>,
  ) {}

  async saveSets(saveSetDto: SaveSetDto[]) {
    return await this.setsRepository.save(saveSetDto);
  }

  async getSets(userId: string, exerciseId: string, sessionId?: string) {
    return await this.setsRepository.findBy({
      userId,
      exerciseId,
      sessionId: sessionId ?? IsNull(),
    });
  }

  async combineSets(sessionByExercises: Record<string, string | null>) {
    const exerciseIds = Object.keys(sessionByExercises);
    if (exerciseIds.length === 0) {
      return {};
    }

    // 1) подходы без назначенных сессий
    const setsWithNullSession = await this.setsRepository.find({
      where: {
        exerciseId: In(exerciseIds),
        sessionId: IsNull(),
      },
      order: { order: "ASC" },
    });

    // собираем exerciseIds без назначенных сессий
    const exerciseIdsWithNullSession = new Set(
      setsWithNullSession?.map((set) => set.exerciseId),
    );

    // 2) Для тех упражнений, где нет null-сетов, берём назначенные
    const assignedExerciseIds = exerciseIds.filter((exerciseId) => {
      return (
        !exerciseIdsWithNullSession.has(exerciseId) &&
        sessionByExercises[exerciseId] !== null
      );
    });

    const assignedSets = assignedExerciseIds.length
      ? await this.setsRepository.find({
          where: {
            exerciseId: In(assignedExerciseIds),
            sessionId: In(
              assignedExerciseIds.map((id) => sessionByExercises[id]!),
            ),
          },
          order: { order: "ASC" },
        })
      : [];

    // 3) Формируем результат: exerciseId -> массив SetEntity
    const result: Record<string, SetEntity[]> = {};

    for (const id of exerciseIds) {
      if (exerciseIdsWithNullSession.has(id)) {
        // Если есть null-сеты — берём их
        result[id] = setsWithNullSession.filter((set) => set.exerciseId === id);
      } else {
        // Иначе — берём назначенные
        result[id] = assignedSets.filter((set) => set.exerciseId === id);
      }
    }

    return result;
  }

  // async updateSessionsInSets(ids: string[], sessionId: string) {
  //   return await this.setsRepository.update({ id: In(ids) }, { sessionId });
  // }
}
