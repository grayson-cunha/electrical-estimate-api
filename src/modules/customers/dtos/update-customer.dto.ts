import { IsString, IsEmail } from 'class-validator';

export class UpdateCustomerDto {
  @IsString()
  name?: string;

  @IsString()
  phoneNumber?: string;

  @IsString()
  @IsEmail()
  email?: string;
}
