import { CurrentUser } from "@auth/decorators";
import { Body, Controller, Post } from "@nestjs/common";
import { User } from "@users/entities/user.entity";

import { CreateProfileDto } from "./dto/create-profile";
import { ProfilesService } from "./profiles.service";

@Controller("profile")
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  @Post("create")
  // @UseGuards(JwtAuthGuard)
  async createProfile(
    @CurrentUser() user: User,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return await this.profileService.createProfile(createProfileDto, user.id);
  }
}
