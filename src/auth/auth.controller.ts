import { Response } from "express";

import { JwtRefreshAuthGuard, LocalAuthGuard } from "@auth/guards";
import { GoogleAuthGuard } from "@auth/guards/google-auth.guard";
import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreateUserDto } from "@users/dto/create-user.dto";
import { User } from "@users/entities/user.entity";
import { UsersService } from "@users/users.service";

import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Post("sign_up")
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const createdUser = await this.usersService.createUser(createUserDto);

    const signedUpUser = await this.authService.login(createdUser, response);

    return { id: signedUpUser.id };
  }

  @Post("sign_in")
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    const signedInUser = await this.authService.login(user, response);
    return { id: signedInUser.id, hasProfile: signedInUser.hasProfile };
  }

  @Post("refresh")
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    const signedInUser = await this.authService.login(user, response);
    return { accessToken: signedInUser.accessToken };
  }

  @Get("google")
  @UseGuards(GoogleAuthGuard)
  loginGoogle() {}

  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    const signedInUser = await this.authService.login(user, response);

    if (signedInUser.hasProfile) {
      response.redirect(this.configService.getOrThrow("REDIRECT_TO_DASHBOARD"));
    } else {
      response.redirect(this.configService.getOrThrow("REDIRECT_TO_PROFILE"));
    }
  }
}
