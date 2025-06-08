import { Repository } from "typeorm";

import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "@users/users.service";

import { CreateProfileDto } from "./dto/create-profile";
import { Profile } from "./entities/profile.entity";

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    private readonly usersService: UsersService,
  ) {}

  async getProfiles() {
    return await this.profilesRepository.find();
  }

  async createProfile(profile: CreateProfileDto, userId: string) {
    const userWithProfile = await this.usersService.find(
      { id: userId },
      { relations: ["profile"] },
    );

    if (userWithProfile.profile) {
      throw new BadRequestException("Profile already exists");
    }

    const savedProfile = await this.profilesRepository.save(profile);

    return await this.usersService.addProfile(savedProfile, userId);
  }
}
