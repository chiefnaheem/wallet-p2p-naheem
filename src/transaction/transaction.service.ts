import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { WalletService } from '../wallet/wallet.service';
// import {AuthService} from '../auth/auth.service';
import { User } from '@prisma/client';
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

      const user = await this.prisma.user.findUnique({
        where: {
          email: receiverWalletEmail,
        },
      });
      if (!user) {
        throw new ForbiddenException('user not found');
      }
  
      const findWallet = await this.prisma.wallet.findUnique({
        where: {
          userId: user.id,
        },
      });
      if (!findWallet) {
        throw new ForbiddenException('wallet not found');
      }
      findWallet.balance += amount;
      const balance = await this.prisma.wallet.update({
        where: {
          userId: user.id,
        },
        data: {
          balance: findWallet.balance,
        },
      });

      console.log(verifyTransaction);
      return balance;
    } catch (error) {
      console.log(error.message);
      throw new ForbiddenException(error.message);
    }
  }

  async sendMoneyToAnotherUser(authUser: User, dto:CreateTransactionDto){
    try{

      const user = await this.prisma.user.findUnique({
        where: {

          id: authUser.id
        }
      })
      if(user.email !== dto.receiverWalletEmail)  {
        return {message:'use your registered account to fund your account', status: false, payload: ''}
      }
      return await this.createTransaction(dto)
    }catch(error) {
      console.log(error.message)
    }

  }
}
