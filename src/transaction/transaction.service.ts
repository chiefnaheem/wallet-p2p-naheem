import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async createTransaction(
    userId: string,
    receiverWalletEmail: string,
    createTransactionDto: CreateTransactionDto,
  ) {
    // const donor = await this.prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    // });

    const donorWallet = await this.prisma.wallet.findUnique({
      where: {
        id: userId,
      },
    });

    const recipientWallet = await this.prisma.user.findUnique({
      where: {
        email: receiverWalletEmail,
      },
    })

    if (!donorWallet || donorWallet.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    if (donorWallet.balance < createTransactionDto.amount) {
      throw new Error('Insufficient balance');
    }
    if (!recipientWallet) {
      throw new Error('wallet email does not exist');
    }
    await this.prisma.transaction.create({  
        data: {
            ...createTransactionDto,
        }
    });

    donorWallet.balance = donorWallet.balance - createTransactionDto.amount;
    // const donorBalance = await donorWallet.


    // return transaction;
  }
}
