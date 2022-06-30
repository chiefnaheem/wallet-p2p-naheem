import { Module } from '@nestjs/common';
import { WalletService } from '../wallet/wallet.service';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
// import { HttpModule } from '@nestjs/axios';

@Module({
  //   imports: [WalletService],
  controllers: [TransactionController],
  providers: [TransactionService, WalletService],
  exports: [TransactionService],
})
export class TransactionModule {}
