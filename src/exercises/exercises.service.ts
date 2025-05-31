import { Repository } from "typeorm";

import { Exercise } from "@exercises/entities/exercise.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { UpdateExerciseDto } from "./dto/update-exercise.dto";

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exercisesRepository: Repository<Exercise>,
  ) {}

  async create(createExerciseDto: CreateExerciseDto) {
    return await this.exercisesRepository.save(createExerciseDto);
  }

  async findAll() {
    return await this.exercisesRepository.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} exercise`;
  }

  update(id: string, updateExerciseDto: UpdateExerciseDto) {
    return `This action updates a #${id} exercise`;
  }

  async remove(id: string) {
    return await this.exercisesRepository.delete(id);
  }
}
