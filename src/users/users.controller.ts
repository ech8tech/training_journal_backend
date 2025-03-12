import { CurrentUser } from "@auth/decorators";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { CacheInterceptor, CacheKey } from "@nestjs/cache-manager";
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

@Controller("users")
@UseInterceptors(CacheInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("create")
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put("update")
  updateUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.update(createUserDto);
  }

  @CacheKey("getUsers")
  @Get()
  @UseGuards(JwtAuthGuard)
  getUsers(@CurrentUser() user: User) {
    return this.usersService.findAll();
  }
}
