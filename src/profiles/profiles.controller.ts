import { CurrentUser } from "@auth/decorators";
import { JwtAuthGuard } from "@auth/guards";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { User } from "@users/entities/user.entity";

import { CreateProfileDto } from "./dto/create-profile";
import { ProfilesService } from "./profiles.service";

@Controller("profile")
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfiles() {
    return await this.profileService.getProfiles();
  }

  @Get("check")
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@CurrentUser() user: User) {
    const profileFound = await this.profileService.getUserProfile(user.id);
    return { id: profileFound?.id };
  }

  @Post("create")
  @UseGuards(JwtAuthGuard)
  async createProfile(
    @CurrentUser() user: User,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return await this.profileService.createProfile(createProfileDto, user.id);
  }
}
