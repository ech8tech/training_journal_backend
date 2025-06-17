import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { UsersService } from "@users/users.service";

import { TokenPayload } from "../interfaces";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          if (typeof request.cookies.Authentication === "string") {
            return request.cookies.Authentication;
          }
          return null;
        },
      ]),
      secretOrKey: configService.getOrThrow("JWT_ACCESS_TOKEN_SECRET"),
    });
  }

  async validate(payload: TokenPayload) {
    return this.usersService.findUser({ id: payload.userId });
  }
}
