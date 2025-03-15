import { Response } from "express";

import { JwtRefreshAuthGuard, LocalAuthGuard } from "@auth/guards";
import { GoogleAuthGuard } from "@auth/guards/google-auth.guard";
import { Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { User } from "@users/user.entity";

import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
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
    await this.authService.login(user, response, true);
  }
}
