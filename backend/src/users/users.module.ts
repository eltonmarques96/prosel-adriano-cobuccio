import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailModule } from '@/mail/mail.module';
import { TokenService } from '@/token/token.service';
import { Wallet } from '@/wallet/entities/wallet.entity';
import { WalletService } from '@/wallet/wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet]), MailModule],
  controllers: [UsersController],
  providers: [UsersService, TokenService, WalletService],
  exports: [UsersService],
})
export class UsersModule {}
