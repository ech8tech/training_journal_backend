import { CreateProfileDto } from "src/profiles/dto/create-profile";
import { ProfilesService } from "src/profiles/profiles.service";

import { Body, Controller, Param, Post } from "@nestjs/common";

@Controller("profiles")
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  @Post("create/:userId")
  // @UseGuards(JwtAuthGuard)
  async createProfile(
    @Body() createProfileDto: CreateProfileDto,
    @Param("userId") userId: string,
  ) {
    await this.profileService.createProfile(createProfileDto, userId);
  }
}
