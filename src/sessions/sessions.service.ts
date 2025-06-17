import { In, Repository } from "typeorm";

import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session } from "@sessions/entities/session.entity";
import { SetsService } from "@sets/sets.service";

import { CreateSessionDto, DeleteSessionDto } from "./dto/create-session.dto";

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly setsService: SetsService,
  ) {}

  async getSession(userId: string, exerciseId: string, date: string) {
    return await this.sessionRepository.findOneBy({ userId, exerciseId, date });
  }

  async getSessions(userId: string, exercisesIds: string[]) {
    return await this.sessionRepository.find({
      where: { userId, exerciseId: In(exercisesIds) },
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

      const setsFounded = await this.setsService.getUnassignedSets(
        userId,
        createSessionDto.exerciseId,
      );

      const setsIds = setsFounded.map((set) => set.id);

      if (setsFounded?.length) {
        return await this.setsService.updateSets(setsIds, sessionCreated.id);
      }
    }
  }

  async deleteSession(userId: string, deleteSessionDto: DeleteSessionDto) {
    const sessionFounded = await this.getSession(
      userId,
      deleteSessionDto.exerciseId,
      deleteSessionDto.date,
    );

    if (sessionFounded) {
      const setsFounded = await this.setsService.getSets(sessionFounded.id);

      if (setsFounded?.length) {
        return await this.sessionRepository.delete(sessionFounded.id);
      } else {
        throw new BadRequestException("Не найдены подходы по этой сессии");
      }
    } else {
      throw new BadRequestException("Не найдена сессия");
    }
  }
}
