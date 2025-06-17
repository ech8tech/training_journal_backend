import { CurrentUser } from "@auth/decorators";
import { JwtAuthGuard } from "@auth/guards";
// import { CacheInterceptor } from "@nestjs/cache-manager";
import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  UseGuards,
  // UseInterceptors,
} from "@nestjs/common";
import { User } from "@users/entities/user.entity";

import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@Controller("user")
// @UseInterceptors(CacheInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUser(@CurrentUser() user: User) {
    return this.usersService.findUser({ id: user.id });
  }

  @Put("update")
  updateUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.updateUser(createUserDto);
  }

  @Delete("delete")
  deleteUser(@CurrentUser() user: User) {
    return this.usersService.deleteUser(user.id);
  }
}
