import { Profile } from "src/profiles/profile.entity";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "@users/users.module";

import { ProfilesController } from "./profiles.controller";
import { ProfilesService } from "./profiles.service";

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), UsersModule],
  providers: [ProfilesService],
  controllers: [ProfilesController],
})
export class ProfilesModule {}
