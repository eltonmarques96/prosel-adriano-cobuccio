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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
    expect(user.wallets[0].transactions[0].status).toEqual('completed');
  });

  it('should transfer values between users', async () => {
    expect(service).toBeDefined();
    const userParams: CreateUserDto = {
      firstName: 'John',
      lastName: 'Lennon',
      email: 'john.lennon@beatles.com',
      password: 'password123',
    };
    const secondUserParams: CreateUserDto = {
      firstName: 'Paul',
      lastName: 'Maccaterny',
      email: 'Paul.mc@beatles.com',
      password: 'password123',
    };
    const depositValue = 100;
    const transferValue = 50;
    expect(UsersService).toBeDefined();
    await userService.create(userParams);
    await userService.create(secondUserParams);
    let firstUser = await userService.findByEmail(userParams.email);
    let secondUser = await userService.findByEmail(secondUserParams.email);
    expect(firstUser).toBeDefined();
    expect(secondUser).toBeDefined();
    await service.deposit(firstUser.wallets[0].id, depositValue);
    firstUser = await userService.findByEmail(userParams.email);
    expect(firstUser.wallets[0].balance).toEqual(depositValue * 100000);
    expect(firstUser.wallets[0].transactions[0].status).toEqual('completed');
    await service.transferValue(
      firstUser.wallets[0].id,
      secondUser.wallets[0].id,
      transferValue,
    );
    firstUser = await userService.findByEmail(userParams.email);
    secondUser = await userService.findByEmail(secondUserParams.email);
    expect(secondUser.wallets[0].balance).toEqual(transferValue * 100000);
    expect(firstUser.wallets[0].balance).toEqual(
      (depositValue - transferValue) * 100000,
    );
  });
});
