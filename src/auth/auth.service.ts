import { compare, hash } from "bcryptjs";
import { Response } from "express";

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ProfilesService } from "@profiles/profiles.service";
import { User } from "@users/entities/user.entity";
import { UsersService } from "@users/users.service";

import { TokenPayload } from "./interfaces";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly profilesService: ProfilesService,
  ) {}

  async login(user: User, response: Response) {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            "JWT_ACCESS_TOKEN_EXPIRATION_MS",
          ),
        ),
    );

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(
      expiresRefreshToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            "JWT_REFRESH_TOKEN_EXPIRATION_MS",
          ),
        ),
    );

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow("JWT_ACCESS_TOKEN_SECRET"),
      expiresIn: `${this.configService.getOrThrow("JWT_ACCESS_TOKEN_EXPIRATION_MS")}ms`,
    });
    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: `${this.configService.getOrThrow("JWT_REFRESH_TOKEN_EXPIRATION_MS")}ms`,
    });

    response.cookie("Authentication", accessToken, {
      secure: this.configService.get("NODE_ENV") === "production",
      expires: expiresAccessToken,
    });
    response.cookie("Refresh", refreshToken, {
      httpOnly: true,
      secure: this.configService.get("NODE_ENV") === "production",
      expires: expiresRefreshToken,
    });

    try {
      await this.usersService.updateUser({
        ...user,
        refreshToken: await hash(refreshToken, 10),
      });
    } catch (e) {
      throw new BadRequestException("Не удалось обновить Refresh Token");
    }

    const userProfile = await this.profilesService.getUserProfile(user.id);

    return { ...user, accessToken, hasProfile: !!userProfile?.id };
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.find({ email });

      const authenticated = await compare(password, user.password);

      if (!authenticated) {
        throw new UnauthorizedException("User does not exist");
      }

      return user;
    } catch (_) {
      throw new UnauthorizedException("Access token is not valid");
    }
  }

  async verifyUserRefreshToken(refreshToken: string, payload: TokenPayload) {
    try {
      const user = await this.usersService.find({ id: payload.userId });

      const authenticated = await compare(refreshToken, user.refreshToken);

      if (!authenticated) {
        throw new UnauthorizedException("User does not exist");
      }
      return user;
    } catch (_) {
      throw new UnauthorizedException("Refresh token is not valid");
    }
  }
}
