import { Module } from '@nestjs/common';
import { Wallet } from '@/wallet/entities/wallet.entity';
import { User } from '@/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/users/users.module';
import { MailModule } from '@/mail/mail.module';
import { AuthModule } from '@/auth/auth.module';
import { TokenService } from '@/token/token.service';
import { BullModule } from '@nestjs/bull';
import { TransactionController } from './transaction.controller';
import { WalletService } from '@/wallet/wallet.service';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, User, Transaction]),
    UsersModule,
    MailModule,
    AuthModule,
    BullModule.registerQueue({
      name: 'transaction',
    }),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TokenService, WalletService],
})
export class TransactionModule {}
