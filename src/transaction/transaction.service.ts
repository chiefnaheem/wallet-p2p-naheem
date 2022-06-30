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
  async createTransaction(dto: CreateTransactionDto, authUser?: User) {
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
      if (authUser.email === receiverWalletEmail) {
        return {
          status: false,
          payload: '',
          message: 'you cant send one to yourself',
        };
      }

      const findWallet = await this.prisma.wallet.findUnique({
        where: {
          userId: authUser.id,
        },
      });
      if (!findWallet) {
        throw new ForbiddenException('wallet not found');
      }
      const setBalanceDonor = findWallet.balance - amount;
      const receiver = await this.prisma.user.findUnique({
        where: {
          email: receiverWalletEmail,
        },
      });
      const walletReceiver = await this.prisma.wallet.findUnique({
        where: {
          userId: receiver.id,
        },
      });
      const setBalanceReceiver = walletReceiver.balance + amount;

      const balanceDonor = await this.prisma.wallet.update({
        where: {
          userId: authUser.id,
        },
        data: {
          balance: setBalanceDonor,
        },
      });
      const balanceReceiver = await this.prisma.wallet.update({
        where: {
          userId: receiver.id,
        },
        data: {
          balance: setBalanceReceiver,
        },
      });

      console.log(verifyTransaction);
      // return {balanceDonor, balanceReceiver, transaction};
      return {
        status: 'success',
        message: 'transaction successful',
        payload: { myBalance: balanceDonor, transaction },
      };
    } catch (error) {
      console.log(error.message);
      throw new ForbiddenException(error.message);
    }
  }

  async sendMoneyToAnotherUser(authUser: User, dto: CreateTransactionDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: authUser.id,
        },
      });
      if (user.email !== dto.receiverWalletEmail) {
        return {
          message: 'use your registered account to fund your account',
          status: false,
          payload: '',
        };
      }
      return await this.createTransaction(dto);
    } catch (error) {
      console.log(error.message);
    }
  }
}
