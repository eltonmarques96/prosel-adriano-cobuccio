import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { TokenService } from '@/token/token.service';
import { MailModule } from '@/mail/mail.module';
import { WalletModule } from '@/wallet/wallet.module';

@Module({
  imports: [
    UsersModule,
    MailModule,
    WalletModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: process.env.JWT_SECRET || 'your-secret-key-abc',
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    TokenService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
