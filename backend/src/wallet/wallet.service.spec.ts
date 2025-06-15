import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from '@/database/typeorm.config';
import { User } from '@/users/entities/user.entity';
import { Wallet } from './entities/wallet.entity';
import { UsersService } from '@/users/users.service';
import { TokenService } from '@/token/token.service';
import { AuthGuard } from '@/auth/auth.guard';
import { MailService } from '@/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { TransactionService } from '@/transaction/transaction.service';
import { Transaction } from '@/transaction/entities/transaction.entity';
import { CreateUserDto } from '@/users/dto/create-user.dto';

describe('WalletService', () => {
  let service: WalletService;
  let userService: UsersService;
  let tokenService: TokenService;
  let transactionService: TransactionService;
  const mockMailService = {
    sendUserConfirmation: jest.fn(),
    sendPasswordRecovery: jest.fn(),
  };
  const mockTransationService = {
    create: jest.fn(),
    deposit: jest.fn(),
    addTransactionToQueue: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        AuthGuard,
        UsersService,
        { provide: MailService, useValue: mockMailService },
        { provide: TransactionService, useValue: mockTransationService },
        WalletService,
        TokenService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            signAsync: jest.fn().mockResolvedValue('mocked-jwt-token'),
            verify: jest.fn(),
          },
        },
      ],
      imports: [
        TypeOrmModule.forRoot(getTypeOrmConfig()),
        TypeOrmModule.forFeature([User, Wallet, Transaction]),
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    userService = module.get<UsersService>(UsersService);
    tokenService = module.get<TokenService>(TokenService);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(tokenService).toBeDefined();
    expect(userService).toBeDefined();
    expect(transactionService).toBeDefined();
  });

  it('should create an Wallet after the user registration', async () => {
    expect(service).toBeDefined();
    const userParams: CreateUserDto = {
      firstName: 'John',
      lastName: 'Lennon',
      email: 'john.lennon@beatles.com',
      password: 'password123',
    };
    expect(UsersService).toBeDefined();
    await userService.create(userParams);
    const user = await userService.findByEmail(userParams.email);
    expect(user).toBeDefined();
    expect(user.wallets.length).toEqual(1);
  });
});
