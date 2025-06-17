import { Repository } from "typeorm";

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateProfileDto } from "./dto/create-profile";
import { Profile } from "./entities/profile.entity";

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
  ) {}

  async getProfile(userId: string) {
    const profileFound = await this.profilesRepository.findOneBy({ userId });

    if (!profileFound) {
      throw new NotFoundException("Профиль не найден");
    }

    return profileFound;
  }

  async createProfile(userId: string, createProfileDto: CreateProfileDto) {
    const profile = await this.getProfile(userId);

    if (profile) {
      throw new BadRequestException(
        "Профиль у данного пользователя уже существует",
      );
    }

    try {
      return await this.profilesRepository.save({
        ...createProfileDto,
        userId,
      });
    } catch (error) {
      throw new InternalServerErrorException("Ошибка создания профиля");
    }
  }
}
