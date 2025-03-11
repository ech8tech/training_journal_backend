import { CurrentUser } from "@auth/decorators";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("create")
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(@CurrentUser() user: User) {
    console.log(user);
    return this.usersService.findAll();
  }
}
