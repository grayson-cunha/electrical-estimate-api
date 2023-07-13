import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user-dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user-dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  async createUser(@Body() newUser: CreateUserDto) {
    return this.userService.create(newUser);
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() userData: UpdateUserDto,
  ) {
    return this.userService.update(id, userData);
  }
}
