import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}
  async create(user_id: string): Promise<any> {
    const wallet = new Wallet();
    wallet.balance = 0;
    wallet.enabled = true;
    wallet.user = { id: user_id } as User;
    return await this.walletRepository.save(wallet);
  }

  findAll() {
    return `This action returns all wallet`;
  }

  async findOne(id: string) {
    const wallet = await this.walletRepository.findOne({
      where: { id: id },
      relations: ['transactions'],
    });
    if (!wallet) {
      throw new NotFoundException(`Wallet not found`);
    }
    return wallet;
  }

  async update(updateWalletDto: UpdateWalletDto) {
    return this.walletRepository.update(updateWalletDto.id, {
      balance: updateWalletDto.balance,
    });
  }

  remove(id: string) {
    return `This action removes a #${id} wallet`;
  }
}
