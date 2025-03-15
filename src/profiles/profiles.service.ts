import { CreateProfileDto } from "src/profiles/dto/create-profile";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "@users/users.service";

import { Profile } from "./profile.entity";

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    private readonly usersService: UsersService,
  ) {}

  async createProfile(profile: CreateProfileDto, userId: string) {
    const savedProfile = await this.profilesRepository.save(profile);

    await this.usersService.connectWithProfile(savedProfile, userId);
  }
}
