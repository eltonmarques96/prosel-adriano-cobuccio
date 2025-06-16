import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { User } from '@/users/entities/user.entity';
import { TokenService } from '@/token/token.service';
import { UsersModule } from '@/users/users.module';
import { MailModule } from '@/mail/mail.module';
import { Transaction } from '@/transaction/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, User, Transaction]),
    UsersModule,
    MailModule,
  ],
  providers: [WalletService, TokenService],
  exports: [WalletService],
})
export class WalletModule {}
