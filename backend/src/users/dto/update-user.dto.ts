import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  id?: string;
  @ApiProperty()
  @IsString()
  readonly firstName?: string;
  @ApiProperty()
  @IsString()
  readonly lastName?: string;
  @ApiProperty()
  @IsEmail()
  readonly email?: string;
  @ApiProperty()
  @IsString()
  @Length(6, 15)
  readonly phone?: string;
}
