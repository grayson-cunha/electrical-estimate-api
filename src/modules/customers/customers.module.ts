import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { Customer, CustomerSchema } from './customers.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  controllers: [CustomersController],
  providers: [],
})
export class CustomersModule {}
