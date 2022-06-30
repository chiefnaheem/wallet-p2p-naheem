import { Injectable, ForbiddenException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WalletService {
  private readonly httpService: HttpService;
  constructor() {
    this.httpService = new HttpService();
  }
  //   async createCustomerPaystack(payload: CreateWalletDto) {
  //     try {
  //       const response = await this.httpService.post(
  //         'https://api.paystack.co/customer',
  //         payload,
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${process.env.AUTH_KEY}`,
  //           },
  //         },
  //       );

  //       const result = await lastValueFrom(response);
  //       return result.data.data;
  //     } catch (error) {
  //         console.log(error)
  //       throw new ForbiddenException(error.message);
  //     }
  //   }

  //   async createVirtualAccount(customerId: string) {
  //     try {
  //       const response = await this.httpService.post(
  //         'https://api.paystack.co/dedicated_account',
  //         { customer: customerId, preferred_bank: 'wema-bank' },
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${process.env.AUTH_KEY}`,
  //           },
  //         },
  //       );

  //       const result = await lastValueFrom(response);
  //       return result.data.data;
  //     } catch (error) {
  //         console.log(error)
  //       throw new ForbiddenException(error.message);
  //     }
  //   }

  async initializeFunds(email: string, amount: number) {
    try {
      const response = await this.httpService.post(
        'https://api.paystack.co/transaction/initialize',
        { email, amount },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.AUTH_KEY}`,
          },
        },
      );
      const result = await lastValueFrom(response);
      if (result.data.status === false) {
        throw new ForbiddenException(result.data.message);
      }
      return result.data.data.reference;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  async verifyTransaction(reference: string) {
    try {
      const response = await this.httpService.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.AUTH_KEY}`,
          },
        },
      );
      const result = await lastValueFrom(response);
      if (result.data.status === false) {
        throw new ForbiddenException(result.data.message);
      }
      return result.data.data;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
