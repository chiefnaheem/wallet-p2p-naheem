import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { WalletService } from '../wallet/wallet.service';
// import {AuthService} from '../auth/auth.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private walletService: WalletService,
  ) {}
  async createTransaction(dto: CreateTransactionDto) {
    const { receiverWalletEmail, amount, description } = dto;
    try {
      const reference = await this.walletService.initializeFunds(
        receiverWalletEmail,
        amount,
      );
      if (!reference) {
        console.log('hey error');
        throw new ForbiddenException('cant get the reference');
      }
      const transaction = await this.prisma.transaction.create({
        data: {
          reference,
          receiverWalletEmail,
          amount,
          description,
        },
      });
      const verifyTransaction = await this.walletService.verifyTransaction(
        reference,
      );
      
      console.log(verifyTransaction.amount);
      return transaction;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error.message);
    }
  }
}
