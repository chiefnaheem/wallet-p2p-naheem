// import { Module } from '@nestjs/common';
// // import { AppController } from './app.controller';
// // import { AppService } from './app.service';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { TransactionModule } from './transaction/transaction.module';

// @Module({
//   imports: [AuthModule, UsersModule, TransactionModule],
//   // controllers: [AppController],
//   // providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
// import { UserModule } from './user/user.module';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { WalletService } from './wallet/wallet.service';
import { WalletController } from './wallet/wallet.controller';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    WalletModule,
    TransactionModule,
  ],
  providers: [WalletService],
  controllers: [WalletController],
})
export class AppModule {}
