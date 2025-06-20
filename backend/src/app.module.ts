import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { getTypeOrmConfig } from '@/database/typeorm.config';
import { BullModule } from '@nestjs/bull';
import { UsersModule } from '@users/users.module';
import { MailModule } from './mail/mail.module';
import { TokenService } from './token/token.service';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 40000,
          limit: 10,
        },
      ],
    }),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
        port: Number(process.env.REDIS_PORT),
      },
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 1000,
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    }),
    PrometheusModule.register({
      path: '/metrics',
    }),
    LoggerModule.forRoot(),
    UsersModule,
    MailModule,
    AuthModule,
    WalletModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [TokenService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
