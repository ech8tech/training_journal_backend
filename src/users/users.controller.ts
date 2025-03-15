import { JwtAuthGuard } from "@auth/guards";
import { CacheInterceptor } from "@nestjs/cache-manager";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
@UseInterceptors(CacheInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("create")
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.usersService.createUser({ ...createUserDto, hasProfile: false });
  }

  @Put("update")
  updateUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.updateUser(createUserDto);
  }

  @Delete("delete/:id")
  deleteUser(@Param("id") id: string) {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers() {
    return this.usersService.findAll();
  }
}
