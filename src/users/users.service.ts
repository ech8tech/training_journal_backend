import { hash } from "bcryptjs";
import { FindOneOptions, Repository } from "typeorm";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "@profiles/entities/profile.entity";

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

  async find(user: Partial<User>, options?: FindOneOptions<User>) {
    const foundUser = await this.usersRepository.findOne({
      where: user,
      ...options,
    });

    if (!foundUser) {
      throw new NotFoundException("User does not exist");
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

  async addProfile(savedProfile: Profile, userId: string) {
    await this.usersRepository
      .createQueryBuilder()
      .relation(User, "profile")
      .of(userId)
      .set(savedProfile.id);

    await this.updateUser({ id: userId, hasProfile: true });
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
