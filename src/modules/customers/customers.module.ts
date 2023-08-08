import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CustomersController } from './customers.controller';
import { Customer } from './customers.model';

@Module({
  imports: [SequelizeModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [],
})
export class CustomersModule {}
