import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email?: string;
}
