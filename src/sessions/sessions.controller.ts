import { CurrentUser } from "@auth/decorators";
import { JwtAuthGuard } from "@auth/guards";
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { User } from "@users/entities/user.entity";

import { CreateSessionDto, DeleteSessionDto } from "./dto/create-session.dto";
import { SessionsService } from "./sessions.service";

@Controller("session")
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post("create")
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: User,
    @Body() createSessionDto: CreateSessionDto,
  ) {
    return await this.sessionsService.createSession(user.id, createSessionDto);
  }

  @Delete("delete/:exerciseId")
  @UseGuards(JwtAuthGuard)
  async delete(
    @CurrentUser() user: User,
    @Param("exerciseId") exerciseId: string,
    @Body() deleteSessionDto: DeleteSessionDto,
  ) {
    return await this.sessionsService.deleteSession(user.id, exerciseId);
  }
}
