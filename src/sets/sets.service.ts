import { In, IsNull, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Set } from "@sets/entities/set.entity";

import { CreateSetDto } from "./dto/create-set.dto";
import { UpdateSetDto } from "./dto/update-set.dto";

@Injectable()
export class SetsService {
  constructor(
    @InjectRepository(Set)
    private readonly sets: Repository<Set>,
  ) {}

  async addSets(createSetDto: CreateSetDto[]) {
    try {
      console.log("createSetDto", createSetDto);
      return await this.sets.save(createSetDto);
    } catch (e) {
      console.log(e);
    }
  }

  async findAll() {
    return await this.sets.find();
  }

  async findSetsWithoutSessions(userId: string, exerciseId: string) {
    return await this.sets.find({
      where: { userId, exerciseId, sessionId: IsNull() },
    });
  }

  async findSetsBySessionId(sessionId: string) {
    return await this.sets.find({ where: { sessionId } });
  }

  async updateSetsByIds(ids: string[], sessionId: string) {
    return await this.sets.update({ id: In(ids) }, { sessionId });
  }

  update(id: number, updateSetDto: UpdateSetDto) {
    return `This action updates a #${id} set`;
  }

  remove(id: number) {
    return `This action removes a #${id} set`;
  }
}
