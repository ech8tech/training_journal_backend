import dayjs from "dayjs";
import { In, Repository } from "typeorm";

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session } from "@sessions/entities/session.entity";
import { SetsService } from "@sets/sets.service";

import { CreateSessionDto } from "./dto/create-session.dto";

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly setsService: SetsService,
  ) {}

  async getSession(userId: string, exerciseId: string, date?: string) {
    return await this.sessionRepository.findOneBy({ userId, exerciseId, date });
  }

  async getSessions(userId: string, exercisesIds: string[]) {
    return await this.sessionRepository.find({
      where: {
        userId,
        exerciseId: In(exercisesIds),
      },
      relations: ["sets"],
      order: { date: "DESC" },
    });
  }

  async createSession(userId: string, createSessionDto: CreateSessionDto) {
    const sessionFounded = await this.getSession(
      userId,
      createSessionDto.exerciseId,
      createSessionDto.date,
    );

    // если сессии нет, то добавляем сессию и обновляем подходы, добавляем sessionId вместо null
    if (!sessionFounded) {
      const sessionCreated = await this.sessionRepository.save({
        userId,
        exerciseId: createSessionDto.exerciseId,
        date: createSessionDto.date,
      });

      const setsUnassigned = await this.setsService.getSets(
        userId,
        createSessionDto.exerciseId,
      );

      console.log(setsUnassigned);

      if (setsUnassigned?.length) {
        return await this.setsService.saveSets(
          setsUnassigned.map((set) => ({
            ...set,
            sessionId: sessionCreated.id,
          })),
        );
      }

      if (createSessionDto?.sets?.length) {
        return await this.setsService.saveSets(
          createSessionDto.sets.map((set) => ({
            ...set,
            sessionId: sessionCreated.id,
            exerciseId: createSessionDto.exerciseId,
            userId,
          })),
        );
      }

      return new BadRequestException("Добавьте подходы для создании сессии");
    }

    return new BadRequestException(
      "Сессия для этого упражнения уже существует",
    );
  }

  async deleteSession(userId: string, exerciseId: string) {
    const sessionFounded = await this.getSession(
      userId,
      exerciseId,
      dayjs().format("YYYY-MM-DD"),
    );

    if (!sessionFounded) {
      throw new NotFoundException("Сессия не найдена");
    }

    return await this.sessionRepository.remove(sessionFounded);
  }
}
