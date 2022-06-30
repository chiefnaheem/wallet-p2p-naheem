import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
