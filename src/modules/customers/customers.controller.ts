import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Customer } from './customers.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  @Get()
  getAll(): Promise<Customer[]> {
    return this.customerModel.find();
  }

  @Post()
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    const customerModel = new this.customerModel(createCustomerDto);
    return customerModel.save();
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() customerData: UpdateCustomerDto,
  ) {
    const customer = await this.customerModel.findByIdAndUpdate(
      id,
      customerData,
      { new: true },
    );

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return customer;
  }
}
