import { Repository } from "typeorm";

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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

  async getProfiles() {
    return await this.profilesRepository.find();
  }

  async getUserProfile(userId: string) {
    return await this.profilesRepository.findOneBy({ userId });
  }

  async createProfile(profile: CreateProfileDto, userId: string) {
    const userProfile = await this.getUserProfile(userId);

    if (userProfile) {
      throw new BadRequestException("Profile already exists");
    }

    try {
      return await this.profilesRepository.save({ ...profile, userId });
    } catch (error) {
      throw new InternalServerErrorException("Ошибка создания профиля");
    }
  }
}
