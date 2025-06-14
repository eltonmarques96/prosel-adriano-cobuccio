import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { Public } from '@/metadata';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 201, description: 'User Created' })
  async create(@Body() createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    return await this.usersService
      .create(createUserDto)
      .then((user) => new ReturnUserDto(user));
  }

  @Public()
  @Post('/forgotpassword')
  @ApiOperation({ summary: 'Request the reset the password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
      },
      required: ['email'],
    },
  })
  @ApiResponse({ status: 200, description: 'E-mail with token sent' })
  async forgotpassword(
    @Body()
    { email }: { email: string },
  ): Promise<{ status: number; body: { message: string } }> {
    return await this.usersService.forgotpassword(email);
  }

  @Public()
  @ApiOperation({ summary: 'Reset User password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
        },
        newPassword: {
          type: 'string',
        },
      },
      required: ['email'],
    },
  })
  @Post('/resetpassword')
  async resetpassword(
    @Body() { token, newPassword }: { token: string; newPassword: string },
  ): Promise<{ status: number; body: { message: string } }> {
    return await this.usersService.resetPassword(token, newPassword);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get User Info by ID' })
  async findOne(@Param('id') id: string): Promise<ReturnUserDto> {
    return await this.usersService
      .findOne(id)
      .then((user) => new ReturnUserDto(user));
  }

  @Public()
  @Patch(':id')
  @ApiOperation({ summary: 'Update User' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReturnUserDto> {
    return await this.usersService
      .update(id, updateUserDto)
      .then((user) => new ReturnUserDto(user));
  }

  @Public()
  @Put('/verify')
  @ApiOperation({ summary: 'Enable User to Login' })
  async verify(@Query('token') token: string): Promise<ReturnUserDto> {
    return await this.usersService
      .verify(token)
      .then((user) => new ReturnUserDto(user));
  }

  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete User' })
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
