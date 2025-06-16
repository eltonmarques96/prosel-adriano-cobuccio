import { Controller, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/deposit')
  @ApiOperation({ summary: 'Deposit value in wallet' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sourceWallet: {
          type: 'string',
        },
        destination_wallet: {
          type: 'string',
        },
        amount: {
          type: 'number',
        },
      },
      required: ['sourceWallet', 'destination_wallet', 'amount'],
    },
  })
  async deposit(
    @Body() { wallet_id, amount }: { wallet_id: string; amount: number },
  ) {
    return await this.transactionService.deposit(wallet_id, amount);
  }

  @Post('/transfer')
  @ApiOperation({ summary: 'Transfer values between wallets' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sourceWallet: {
          type: 'string',
        },
        destination_wallet: {
          type: 'string',
        },
        amount: {
          type: 'number',
        },
      },
      required: ['sourceWallet', 'destination_wallet', 'amount'],
    },
  })
  async transfer(
    @Body()
    {
      sourceWallet,
      destination_wallet,
      amount,
    }: {
      sourceWallet: string;
      destination_wallet: string;
      amount: number;
    },
  ) {
    return await this.transactionService.transferValue(
      sourceWallet,
      destination_wallet,
      amount,
    );
  }

  @Post('/devolution')
  @ApiOperation({ summary: 'Devolution of value' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        transaction_id: {
          type: 'string',
        },
      },
      required: ['transaction_id'],
    },
  })
  async devolution(
    @Body()
    { transaction_id }: { transaction_id: string },
  ) {
    return await this.transactionService.devolution(transaction_id);
  }
}
