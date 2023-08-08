import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Customer } from './customers.model';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(@InjectModel(Customer) private customerModel: typeof Customer) {}

  @Get()
  getAll(): Promise<Customer[]> {
    return this.customerModel.findAll();
  }

  @Post()
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    const customerModel = new this.customerModel({ ...createCustomerDto });
    return customerModel.save();
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() customerData: UpdateCustomerDto,
  ) {
    const customer = await this.customerModel.findByPk(Number(id));

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return customer.update(customerData);
  }
}
