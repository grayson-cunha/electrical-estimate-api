import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';

import * as request from 'supertest';
import { Model } from 'sequelize-typescript';

import { CustomersModule } from '../src/modules/customers/customers.module';
import { ConfigurationModule } from '../src/modules/configuration/configuration.module';
import { Customer } from '../src/modules/customers/customers.model';

describe('CustomersController (e2e)', () => {
  let app: INestApplication;
  let customerModel;
  let customerMock;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigurationModule, CustomersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    customerMock = {
      name: 'Uzumaki Naruto',
      email: 'naruto@uzumaki.com.br',
      phoneNumber: '31999999999',
    };

    customerModel = moduleFixture.get<Model<Customer>>(getModelToken(Customer));

    await customerModel.destroy({ where: {}, truncate: true });
  });

  it('should get an empty customer array', () => {
    return request(app.getHttpServer())
      .get('/customers')
      .expect(HttpStatus.OK)
      .then((res) => {
        const { body } = res;

        expect(body).toHaveLength(0);
      });
  });

  it('should return a customer and status 201 when post a customer', () => {
    return request(app.getHttpServer())
      .post('/customers')
      .send(customerMock)
      .expect(HttpStatus.CREATED)
      .then((res) => {
        const { id, name, email, phoneNumber, createdAt } = res.body;

        expect(id).toBeDefined();
        expect(createdAt).toBeDefined();
        expect(name).toBe('Uzumaki Naruto');
        expect(email).toBe('naruto@uzumaki.com.br');
        expect(phoneNumber).toBe('31999999999');
      });
  });

  it('should return a customer updated and status 200 when update a customer', async () => {
    const CustomerModel = new customerModel(customerMock);

    const newCustomer = await CustomerModel.save();

    return request(app.getHttpServer())
      .put(`/customers/${newCustomer.id}`)
      .send({
        phoneNumber: '31888888888',
      })
      .expect(HttpStatus.OK)
      .then((res) => {
        const { phoneNumber } = res.body;

        expect(phoneNumber).toBe('31888888888');
      });
  });
});
