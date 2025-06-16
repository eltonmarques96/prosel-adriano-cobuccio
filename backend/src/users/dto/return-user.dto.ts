import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnUserDto {
  @ApiProperty()
  @IsString()
  id: string;
  @ApiProperty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsString()
  lastName: string;
  @ApiProperty()
  @IsString()
  phone?: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  wallets?: { id: string; balance: number }[];
  @IsBoolean()
  readonly activated: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.phone = user.phone;
    this.email = user.email;
    this.activated = user.activated;
    this.wallets = user.wallets?.map((wallet) => ({
      id: wallet.id,
      balance: wallet.balance,
    }));
  }
}
