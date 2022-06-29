import { IsNotEmpty, IsString, IsInt } from 'class-validator';
export class CreateTransactionDto {
  @IsNotEmpty()
  @IsInt()
  amount: number;

  @IsNotEmpty()
  @IsString()
  receiverWalletEmail: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  senderWalletId: string;
}
