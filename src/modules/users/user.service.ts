import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from './user.model';
import { CreateUserDto } from './dtos/create-user-dto';
import { UpdateUserDto } from './dtos/update-user-dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(newUser: CreateUserDto) {
    const user = await this.userModel.findOne({ email: newUser.email });

    if (user) {
      throw new BadRequestException(
        `Usuário com o email ${newUser.email} já existe`,
      );
    }

    const salt = 8;

    const hash = await bcrypt.hash(newUser.password, salt);

    const UserModel = new this.userModel({ ...newUser, hashPassword: hash });

    return UserModel.save();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(`Usuário com o id ${id} não encontrado`);
    }

    return user;
  }

  async update(id: string, userData: UpdateUserDto) {
    let newHash: string;
    let user: any;

    if (userData.password) {
      const salt = 8;

      newHash = await bcrypt.hash(userData.password, salt);

      user = { ...userData, hashPassword: newHash };
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });

    if (!updatedUser) {
      throw new NotFoundException(`Usuário com o id ${id} não encontrado`);
    }

    return updatedUser;
  }
}
