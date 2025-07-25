import { hash } from "bcryptjs";
import { Repository } from "typeorm";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  async findUser(
    user: Partial<Pick<User, "id" | "email">>,
    // options?: FindOneOptions<User>,
  ) {
    const foundUser = await this.usersRepository.findOneBy({
      ...user,
      // ...options,
    });

    if (!foundUser) {
      throw new NotFoundException("Пользователя не существует");
    }

    return foundUser;
  }

  async createUser(createUserDto: CreateUserDto) {
    return this.usersRepository.save({
      ...createUserDto,
      password: await hash(createUserDto.password, 10),
    });
  }

  async updateUser(user: Partial<User>) {
    await this.usersRepository.update({ id: user.id }, user);
  }

  async deleteUser(userId: string) {
    await this.usersRepository.delete(userId);
  }

  async getOrCreateUser(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (user) {
      return user;
    }

    return this.createUser(createUserDto);
  }
}
