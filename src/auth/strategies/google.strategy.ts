import { Profile } from "passport";
import { Strategy } from "passport-google-oauth2";

import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { UsersService } from "@users/users.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.getOrThrow("GOOGLE_AUTH_CLIENT_ID"),
      clientSecret: configService.getOrThrow("GOOGLE_AUTH_CLIENT_SECRET"),
      callbackURL: configService.getOrThrow("GOOGLE_AUTH_REDIRECT_URI"),
      scope: ["profile", "email"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const email = profile?.emails?.[0]?.value;

    if (!email) {
      throw new NotFoundException("Пользователь не найден");
    }

    return this.usersService.getOrCreateUser({
      email,
      password: "",
      provider: "google",
    });
  }
}
