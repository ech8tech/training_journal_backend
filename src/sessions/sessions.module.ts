import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SetsModule } from "@sets/sets.module";

import { Session } from "./entities/session.entity";
import { SessionsController } from "./sessions.controller";
import { SessionsService } from "./sessions.service";

@Module({
  imports: [TypeOrmModule.forFeature([Session]), SetsModule],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
