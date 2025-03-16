import { CreateProfileDto } from "src/profiles/dto/create-profile";
import { ProfilesService } from "src/profiles/profiles.service";

import { CurrentUser } from "@auth/decorators";
import { JwtAuthGuard } from "@auth/guards";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { User } from "@users/user.entity";

@Controller("profile")
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  @Post("create")
  @UseGuards(JwtAuthGuard)
  async createProfile(
    @CurrentUser() user: User,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return await this.profileService.createProfile(createProfileDto, user.id);
  }
}
