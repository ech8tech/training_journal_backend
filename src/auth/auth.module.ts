import { GoogleStrategy } from "@auth/strategies/google.strategy";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ProfilesModule } from "@profiles/profiles.module";
import { UsersModule } from "@users/users.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtRefreshStrategy, JwtStrategy, LocalStrategy } from "./strategies";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule,
    ProfilesModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
