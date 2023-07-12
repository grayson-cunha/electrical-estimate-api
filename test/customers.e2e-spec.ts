import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

import * as request from 'supertest';
import { Model } from 'mongoose';

import { CustomersModule } from '../src/modules/customers/customers.module';
import { ConfigurationModule } from '../src/modules/configuration/configuration.module';
import {
  Customer,
  CustomerDocument,
} from '../src/modules/customers/customers.model';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let customerModel: Model<Customer>;
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

    customerModel = moduleFixture.get<Model<CustomerDocument>>(
      getModelToken(Customer.name),
    );

    await customerModel.deleteMany({});
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
        const { _id, name, email, phoneNumber, createdAt } = res.body;

        expect(_id).toBeDefined();
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
      .put(`/customers/${newCustomer._id}`)
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
