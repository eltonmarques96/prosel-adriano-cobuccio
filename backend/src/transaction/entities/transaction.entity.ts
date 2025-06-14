import { Wallet } from '@/wallet/entities/wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sender_wallet_id' })
  sender_wallet: Wallet;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receiver_wallet_id' })
  receiver_wallet: Wallet;

  @Column({ nullable: false, default: 0 })
  amount: number;

  @Column({ nullable: false, default: 'transactional' })
  type: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @Column({ nullable: false, default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
