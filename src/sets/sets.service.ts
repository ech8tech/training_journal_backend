import { Repository } from "typeorm";

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

  async create(createSetDto: CreateSetDto) {
    return await this.sets.save(createSetDto);
  }

  async findAll() {
    return await this.sets.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} set`;
  }

  update(id: number, updateSetDto: UpdateSetDto) {
    return `This action updates a #${id} set`;
  }

  remove(id: number) {
    return `This action removes a #${id} set`;
  }
}
