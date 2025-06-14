import { Transaction } from '@/transaction/entities/transaction.entity';
import { User } from '@/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, default: 0 })
  balance: number;

  @Column({ default: true })
  enabled: boolean;

  @ManyToOne(() => User, (user) => user.wallets, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet, {
    cascade: true,
  })
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
