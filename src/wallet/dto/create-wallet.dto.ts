import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
