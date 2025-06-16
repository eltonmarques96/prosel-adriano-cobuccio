/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
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
    const newTransaction = await this.transactionRepository.save(transaction);
    await this.queue.add('newTransaction', { transaction: newTransaction });
    return newTransaction;
  }

  async devolution(transaction_id: string) {
    const old_transaction = await this.findOne(transaction_id);
    const transaction = new Transaction();
    transaction.amount = old_transaction.amount;
    transaction.type = 'devolution';
    transaction.status = 'pending';
    transaction.wallet = { id: old_transaction.receiver_wallet } as Wallet;
    transaction.sender_wallet = old_transaction.receiver_wallet;
    transaction.receiver_wallet = old_transaction.sender_wallet;
    const newTransaction = await this.transactionRepository.save(transaction);
    await this.queue.add('newTransaction', { transaction: newTransaction });
    return newTransaction;
  }

  async transferValue(
    sourceWallet: string,
    destination_wallet: string,
    amount: number,
  ) {
    const transaction = new Transaction();
    transaction.amount = amount * 100000;
    transaction.type = 'transfer';
    transaction.status = 'pending';
    transaction.wallet = { id: sourceWallet } as Wallet;
    transaction.sender_wallet = sourceWallet;
    transaction.receiver_wallet = destination_wallet;
    const newTransaction = await this.transactionRepository.save(transaction);
    await this.queue.add('newTransaction', { transaction: newTransaction });
    return newTransaction;
  }

  @Process('newTransaction')
  async addTransactionToQueue(job: Job<createTransaction>) {
    const { transaction } = job.data;
    const destinationWallet = await this.walletService.findOne(
      transaction.receiver_wallet,
    );
    if (!destinationWallet) {
      await this.transactionRepository.update(transaction.id, {
        status: 'canceled',
      });
      throw new NotFoundException(`Wallet not found`);
    }
    if (transaction.type === 'transfer' || transaction.type === 'devolution') {
      const senderWallet = await this.walletService.findOne(
        transaction.sender_wallet,
      );
      if (!senderWallet) {
        await this.transactionRepository.update(transaction.id, {
          status: 'canceled',
        });
        throw new NotFoundException(`Wallet not found`);
      }
      if (senderWallet.balance < transaction.amount) {
        await this.transactionRepository.update(transaction.id, {
          status: 'canceled',
        });
        throw new NotAcceptableException(
          `Balance incompatible with Tranfer amount`,
        );
      }
      await this.walletService.update({
        id: senderWallet.id,
        balance: (senderWallet.balance -= transaction.amount),
      });
    }
    await this.walletService.update({
      id: destinationWallet.id,
      balance: (destinationWallet.balance += transaction.amount),
    });
    await this.transactionRepository.update(transaction.id, {
      status: 'completed',
    });
  }

  findAll() {
    return `This action returns all transaction`;
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: id },
    });
    if (!transaction) {
      throw new NotFoundException(`User not found`);
    }
    return transaction;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
