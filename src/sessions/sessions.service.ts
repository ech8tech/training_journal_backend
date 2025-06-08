import { Repository } from "typeorm";

import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session } from "@sessions/entities/session.entity";
import { SetsService } from "@sets/sets.service";

import { CreateSessionDto, DeleteSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly setsService: SetsService,
  ) {}

  async findSession(userId: string, exerciseId: string, date: string) {
    return await this.sessionRepository.findOne({
      where: { userId, exerciseId, date },
    });
  }

  async createSession(userId: string, createSessionDto: CreateSessionDto) {
    const sessionFounded = await this.findSession(
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

      const setsFounded = await this.setsService.findSetsWithoutSessions(
        userId,
        createSessionDto.exerciseId,
      );

      const setsIds = setsFounded.map((set) => set.id);

      if (setsFounded?.length) {
        return await this.setsService.updateSetsByIds(
          setsIds,
          sessionCreated.id,
        );
      }
    }
  }

  async deleteSession(userId: string, deleteSessionDto: DeleteSessionDto) {
    const sessionFounded = await this.findSession(
      userId,
      deleteSessionDto.exerciseId,
      deleteSessionDto.date,
    );

    if (sessionFounded) {
      const setsFounded = await this.setsService.findSetsBySessionId(
        sessionFounded.id,
      );

      if (setsFounded?.length) {
        return await this.sessionRepository.delete(sessionFounded.id);
      } else {
        throw new BadRequestException("Не найдены подходы по этой сессии");
      }
    } else {
      throw new BadRequestException("Не найдена сессия");
    }
  }

  async findAll() {
    return await this.sessionRepository.find();
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }
}
