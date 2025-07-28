import dayjs from "dayjs";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session } from "@sessions/entities/session.entity";
import { SetEntity } from "@sets/entities/set.entity";

@Injectable()
export class ChartsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async getLineChart(
    userId: string,
    exerciseId: string,
    dateStart: string = dayjs().startOf("month").format("YYYY-MM-DD"),
    dateEnd: string = dayjs().endOf("month").format("YYYY-MM-DD"),
  ) {
    // 1) Делаем запрос к Session, сразу джойним Exercise и Sets
    const raw = await this.sessionRepository
      .createQueryBuilder("s")
      .innerJoin("s.exercise", "e") // связь session → exercise
      .leftJoin("s.sets", "st") // связь session → sets
      .where("e.id = :exerciseId", { exerciseId }) // фильтр по нужному exercise
      .andWhere("e.userId = :userId", { userId }) // проверяем, что упражнение принадлежит юзеру
      .andWhere("s.date >= :dateStart AND s.date < :dateEnd", {
        dateStart,
        dateEnd,
      })
      // 2) Выбираем поля для вывода
      .select("e.name", "exerciseName")
      .addSelect("e.muscleGroup", "muscleGroup")
      .addSelect("s.id", "sessionId")
      .addSelect("s.date", "date")
      // 3) Считаем общий вес в сете: SUM(reps * weight)
      .addSelect("SUM(st.reps * st.weight)", "commonRate")
      // 4) Группируем по сессиям (и по полям упражнения, если СУБД требует)
      .groupBy("s.id")
      .addGroupBy("s.date")
      .addGroupBy("e.name")
      .addGroupBy("e.muscleGroup")
      // 5) Сортируем по дате
      .orderBy("s.date", "DESC")
      // 6) Получаем «сырые» строки
      .getRawMany<{
        exerciseName: string;
        muscleGroup: string;
        sessionId: string;
        date: Date;
        commonRate: string; // в raw — обычно строка
      }>();

    // 7) Если ничего не нашлось — отрабатываем 404
    if (!raw.length) {
      return { lineChartData: [] };
    }

    // 8) Вынимаем metadata из первой строки (все они одинаковые)
    const { exerciseName, muscleGroup } = raw[0];

    // 9) Собираем массив точек для графика
    const lineChartData = raw.map((r) => ({
      date: dayjs(r.date).format("YYYY-MM-DD"),
      commonRate: Number(r.commonRate),
    }));

    return { exerciseName, muscleGroup, lineChartData };
  }

  async getScatterplot(
    userId: string,
    muscleGroup: string,
    dateStart: string,
    dateEnd: string,
  ) {
    try {
      const qb = this.sessionRepository
        // 1) Делаем запрос к Session, сразу джойним Exercise и Sets
        .createQueryBuilder("s")
        .innerJoin("s.exercise", "e")
        .leftJoin("s.sets", "st")
        .where("e.userId = :userId", { userId })
        .andWhere("s.date >= :dateStart AND s.date <= :dateEnd", {
          dateStart,
          dateEnd,
        });

      if (muscleGroup) {
        qb.andWhere("e.muscleGroup = :muscleGroup", { muscleGroup });
      }

      // 2) Выбираем поля для вывода
      const raw = await qb
        .select("e.id", "exerciseId")
        .addSelect("e.name", "exerciseName")
        .addSelect("e.muscleGroup", "muscleGroup")
        .addSelect("s.id", "sessionId")
        .addSelect("s.date", "date")
        // Коррелированный подзапрос для массива сетов
        .addSelect(
          (subQb) =>
            subQb
              .select(
                `
                  COALESCE(
                    JSON_AGG(
                      JSON_BUILD_OBJECT(
                        'id',     st.id,
                        'reps',   st.reps,
                        'weight', st.weight
                      )
                      ORDER BY st.id
                    ),
                    '[]'
                  )
                `,
              )
              .from(SetEntity, "st")
              .where("st.sessionId = s.id"),
          "sets",
        )
        .getRawMany<{
          sessionId: string;
          exerciseId: string;
          exerciseName: string;
          muscleGroup: string;
          date: Date;
          sets: string; // JSON‑строка
        }>();

      // 7) Если ничего не нашлось — отрабатываем 404
      // console.log(raw);

      if (!raw?.length) {
        return [];
      }

      return raw.map((r) => ({
        sessionId: r.sessionId,
        exerciseId: r.exerciseId,
        exerciseName: r.exerciseName,
        muscleGroup: r.muscleGroup,
        date: dayjs(r.date).format("YYYY-MM-DD"),
        sets: r.sets,
        // commonRate: JSON.parse(r.sets).reduce(
        //   (sum: number, st) => sum + st.reps * st.weight,
        //   0,
        // ),
      }));
    } catch (e) {
      console.log(e);
    }
  }

  async getSchedule(
    userId: string,
    dateStart: string = dayjs().startOf("month").format("YYYY-MM-DD"),
    dateEnd: string = dayjs().endOf("month").format("YYYY-MM-DD"),
  ) {
    return this.sessionRepository
      .createQueryBuilder("s")
      .where("s.userId = :userId", { userId })
      .andWhere("s.date >= :dateStart AND s.date <= :dateEnd", {
        dateStart,
        dateEnd,
      })
      .select("ARRAY_AGG(DISTINCT s.date::text)", "dates")
      .getRawOne<{ dates: string[] }>();
  }
}
