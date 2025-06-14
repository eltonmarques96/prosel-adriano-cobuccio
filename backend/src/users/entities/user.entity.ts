import { Wallet } from '@/wallet/entities/wallet.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'John', description: 'User First Name' })
  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, default: false })
  activated: boolean;

  @Column({ default: true })
  enabled: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToMany(() => Wallet, (wallet) => wallet.user, { cascade: true })
  wallets: Wallet[];
}
