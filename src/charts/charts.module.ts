import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "@sessions/entities/session.entity";

import { ChartsController } from "./charts.controller";
import { ChartsService } from "./charts.service";

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  controllers: [ChartsController],
  providers: [ChartsService],
  exports: [ChartsService],
})
export class ChartsModule {}
