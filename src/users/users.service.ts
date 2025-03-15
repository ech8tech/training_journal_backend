import { hash } from "bcryptjs";
import { Cache } from "cache-manager";
import { Repository } from "typeorm";

import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  async find(user: Partial<User>) {
    const foundUser = await this.usersRepository.findOne({ where: user });

    if (!foundUser) {
      throw new NotFoundException("User does not exist");
    }

    return foundUser;
  }

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.save({
      ...createUserDto,
      password: await hash(createUserDto.password, 10),
    });
  }

  async update(user: Partial<User>) {
    await this.usersRepository.update({ id: user.id }, user);
    await this.cacheManager.del("getUsers");
  }

  async getOrCreateUser(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (user) {
      return user;
    }

    return this.create(createUserDto);
  }
}
