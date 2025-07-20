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
  async getUserProfile(@CurrentUser() user: User) {
    return await this.profileService.getProfile(user.id);
  }

  @Post("create")
  @UseGuards(JwtAuthGuard)
  async createProfile(
    @CurrentUser() user: User,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return await this.profileService.createProfile(user.id, createProfileDto);
  }
}
