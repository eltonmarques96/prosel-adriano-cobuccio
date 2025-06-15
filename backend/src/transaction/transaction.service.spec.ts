import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from '@/database/typeorm.config';
import { User } from '@/users/entities/user.entity';
import { Wallet } from '@/wallet/entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UsersService } from '@/users/users.service';
import { AuthGuard } from '@/auth/auth.guard';
import { TokenService } from '@/token/token.service';
import { JwtService } from '@nestjs/jwt';
import { WalletService } from '@/wallet/wallet.service';
import { MailService } from '@/mail/mail.service';
import { getQueueToken } from '@nestjs/bull';

describe('TransactionService', () => {
  let service: TransactionService;
  let userService: UsersService;
  let tokenService: TokenService;
  let walletService: WalletService;

  const queueMock = {
    add: jest
      .fn()
      .mockImplementation(async (jobName: string, transaction: Transaction) => {
        const mockJob = { data: transaction } as any;
        await service.addTransactionToQueue(mockJob);
      }),
  };
  const mockMailService = {
    sendUserConfirmation: jest.fn(),
    sendPasswordRecovery: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        UsersService,
        TokenService,
        WalletService,
        { provide: MailService, useValue: mockMailService },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            signAsync: jest.fn().mockResolvedValue('mocked-jwt-token'),
            verify: jest.fn(),
          },
        },
        { provide: getQueueToken('transaction'), useValue: queueMock },
        TransactionService,
      ],
      imports: [
        TypeOrmModule.forRoot(getTypeOrmConfig()),
        TypeOrmModule.forFeature([User, Wallet, Transaction]),
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    userService = module.get<UsersService>(UsersService);
    walletService = module.get<WalletService>(WalletService);
    tokenService = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(tokenService).toBeDefined();
    expect(walletService).toBeDefined();
  });

  it('should deposit a value on wallet', async () => {
    expect(service).toBeDefined();
    const userParams: CreateUserDto = {
      firstName: 'John',
      lastName: 'Lennon',
      email: 'john.lennon@beatles.com',
      password: 'password123',
    };
    const depositValue = 50;
    expect(UsersService).toBeDefined();
    await userService.create(userParams);
    let user = await userService.findByEmail(userParams.email);
    expect(user).toBeDefined();
    await service.deposit(user.wallets[0].id, depositValue);
    user = await userService.findByEmail(userParams.email);
    expect(user.wallets[0].balance).toEqual(depositValue * 100000);
  });
});
