import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  
} from '@nestjs/common';
import { User } from '@prisma/client';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { getUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('fund')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}
  @HttpCode(201)
  @Post('initialize')
  fundMyWallet(@getUser() user: User, @Body() dto: CreateTransactionDto) {
    // console.log({ dto: dto });
    
    return this.transactionService.createTransaction(dto);
    // return `Successfully registered`
  }
  @HttpCode(200)
  @Post('mywallet')
  fundWallet(@getUser() user: User, @Body() dto: CreateTransactionDto){
    return this.transactionService.sendMoneyToAnotherUser(user, dto)
  }

}
