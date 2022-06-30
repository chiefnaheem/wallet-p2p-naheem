import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto';

@Controller('fund')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}
  @HttpCode(201)
  @Post('initialize')
  register(@Body() dto: CreateTransactionDto) {
    // console.log({ dto: dto });
    return this.transactionService.createTransaction(dto);
    // return `Successfully registered`
  }
}
