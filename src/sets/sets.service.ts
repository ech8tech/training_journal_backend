import { In, IsNull, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Set } from "@sets/entities/set.entity";

import { CreateSetDto } from "./dto/create-set.dto";

@Injectable()
export class SetsService {
  constructor(
    @InjectRepository(Set)
    private readonly setsRepository: Repository<Set>,
  ) {}

  async saveSets(createSetDto: CreateSetDto[]) {
    try {
      return await this.setsRepository.save(createSetDto);
    } catch (e) {
      console.log(e);
    }
  }

  async getUnassignedSets(userId: string, exerciseId: string) {
    return await this.setsRepository.findBy({
      userId,
      exerciseId,
      sessionId: IsNull(),
    });
  }

  async getSets(sessionId: string) {
    return await this.setsRepository.findBy({ sessionId });
  }

  async getSetsBatch({
    sessionIds = [],
    exerciseIds = [],
  }: {
    sessionIds?: string[];
    exerciseIds?: string[];
  }) {
    if (sessionIds.length) {
      return await this.setsRepository.find({
        where: { sessionId: In(sessionIds) },
      });
    }

    if (exerciseIds.length) {
      return await this.setsRepository.find({
        where: { exerciseId: In(exerciseIds) },
      });
    }
  }

  async getUnassignedSetsBatch(userId: string, exerciseIds: string[]) {
    return await this.setsRepository.find({
      where: { userId, exerciseId: In(exerciseIds), sessionId: IsNull() },
    });
  }

  async updateSets(ids: string[], sessionId: string) {
    return await this.setsRepository.update({ id: In(ids) }, { sessionId });
  }
}
