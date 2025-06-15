/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { Wallet } from '@/wallet/entities/wallet.entity';
import { WalletService } from '@/wallet/wallet.service';

interface createTransaction {
  transaction: Transaction;
}
@Injectable()
@Processor('transaction')
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly walletService: WalletService,
    @InjectQueue('transaction') private readonly queue: Queue,
  ) {}

  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }

  async deposit(wallet_id: string, amount: number) {
    const transaction = new Transaction();
    transaction.amount = amount * 100000;
    transaction.type = 'deposit';
    transaction.status = 'pending';
    transaction.wallet = { id: wallet_id } as Wallet;
    transaction.sender_wallet = wallet_id;
    transaction.receiver_wallet = wallet_id;
    await this.queue.add('newTransaction', { transaction: transaction });
    return await this.transactionRepository.save(transaction);
  }

  @Process('newTransaction')
  async addTransactionToQueue(job: Job<createTransaction>) {
    const { transaction } = job.data;
    const destinationWallet = await this.walletService.findOne(
      transaction.receiver_wallet,
    );
    if (!destinationWallet) {
      throw new NotFoundException(`Wallet not found`);
    }
    await this.walletService.update({
      id: destinationWallet.id,
      balance: (destinationWallet.balance += transaction.amount),
    });
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
