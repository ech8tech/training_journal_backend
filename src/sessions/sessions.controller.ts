import { CurrentUser } from "@auth/decorators";
import { JwtAuthGuard } from "@auth/guards";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { SetsService } from "@sets/sets.service";
import { User } from "@users/entities/user.entity";

import { CreateSessionDto, DeleteSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { SessionsService } from "./sessions.service";

@Controller("sessions")
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly setsService: SetsService,
  ) {}

  @Post("create")
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: User,
    @Body() createSessionDto: CreateSessionDto,
  ) {
    return await this.sessionsService.createSession(user.id, createSessionDto);
  }

  @Delete("delete")
  @UseGuards(JwtAuthGuard)
  async delete(
    @CurrentUser() user: User,
    @Body() deleteSessionDto: DeleteSessionDto,
  ) {
    return await this.sessionsService.deleteSession(user.id, deleteSessionDto);
  }

  @Get()
  findAll() {
    return this.sessionsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    // return this.sessionsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(+id, updateSessionDto);
  }
}
