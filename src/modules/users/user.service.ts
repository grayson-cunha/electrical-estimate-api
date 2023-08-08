import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import * as bcrypt from 'bcrypt';

import { User } from './user.model';
import { CreateUserDto } from './dtos/create-user-dto';
import { UpdateUserDto } from './dtos/update-user-dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async create(newUser: CreateUserDto) {
    const user = await this.userModel.findOne({
      where: { email: newUser.email },
    });

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
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`Usuário com o id ${id} não encontrado`);
    }

    return user;
  }

  async update(id: string, userData: UpdateUserDto) {
    let newHash: string;
    const updateData: any = { ...userData };

    if (userData.password) {
      const salt = 8;

      newHash = await bcrypt.hash(userData.password, salt);

      updateData.hashPassword = newHash;
    }

    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`Usuário com o id ${id} não encontrado`);
    }

    return user.update(updateData);
  }
}
