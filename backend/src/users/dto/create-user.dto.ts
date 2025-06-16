import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'User First Name' })
  @IsString()
  readonly firstName: string;
  @ApiProperty()
  @IsString()
  readonly lastName: string;
  @ApiProperty()
  @IsEmail()
  readonly email: string;
  @ApiProperty()
  @IsString()
  readonly password: string;
}
