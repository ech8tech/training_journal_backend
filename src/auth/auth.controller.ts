import { Response } from "express";

import { JwtRefreshAuthGuard, LocalAuthGuard } from "@auth/guards";
import { GoogleAuthGuard } from "@auth/guards/google-auth.guard";
import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "@users/dto/create-user.dto";
import { User } from "@users/user.entity";
import { UsersService } from "@users/users.service";

import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post("sign_up")
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const createdUser = await this.usersService.createUser({
      ...createUserDto,
      hasProfile: false,
    });

    await this.authService.login(createdUser, response);
  }

  @Post("sign_in")
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
  }

  @Post("refresh")
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
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
    await this.authService.login(user, response);
  }
}
