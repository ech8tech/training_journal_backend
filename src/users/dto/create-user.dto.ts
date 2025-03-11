import { IsEmail, IsPhoneNumber } from "class-validator";

export class CreateUserDto {
  @IsPhoneNumber()
  tel: string;

  @IsEmail()
  email: string;

  // @IsStrongPassword()
  password: string;

  refreshToken: string;
}
