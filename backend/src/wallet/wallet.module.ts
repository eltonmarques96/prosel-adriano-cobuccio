import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { User } from '@/users/entities/user.entity';
import { Transaction } from 'typeorm';
import { TokenService } from '@/token/token.service';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { MailModule } from '@/mail/mail.module';
import { TransactionService } from '@/transaction/transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, User, Transaction]),
    UsersModule,
    MailModule,
    WalletModule,
    AuthModule,
  ],
  controllers: [WalletController],
  providers: [WalletService, TokenService, TransactionService],
})
export class WalletModule {}
