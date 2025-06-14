import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from '@/database/typeorm.config';
import { User } from '@/users/entities/user.entity';
import { Wallet } from '@/wallet/entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';

describe('TransactionService', () => {
  let service: TransactionService;
  const mockTransationService = {
    create: jest.fn(),
    deposit: jest.fn(),
    addTransactionToQueue: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: TransactionService, useValue: mockTransationService },
      ],
      imports: [
        TypeOrmModule.forRoot(getTypeOrmConfig()),
        TypeOrmModule.forFeature([User, Wallet, Transaction]),
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
