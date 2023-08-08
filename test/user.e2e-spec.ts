import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';

import * as request from 'supertest';

import { ConfigurationModule } from '../src/modules/configuration/configuration.module';
import { User } from '../src/modules/users/user.model';
import { UsersModule } from '../src/modules/users/users.module';
import { UserService } from '../src/modules/users/user.service';
import { Model } from 'sequelize-typescript';
import { getModelToken } from '@nestjs/sequelize';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userModel;
  let userMock: any;
  let userService: UserService;

  const INVALID_ID = 1000;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigurationModule, UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userMock = {
      name: 'Uzumaki Naruto',
      email: 'naruto@uzumaki.com.br',
      password: '1234',
    };

    userService = moduleFixture.get<UserService>(UserService);

    userModel = moduleFixture.get<Model<User>>(getModelToken(User));
  });

  beforeEach(async () => {
    await userModel.destroy({ where: {}, truncate: true });
  });

  it('should throw not found exception', () => {
    return request(app.getHttpServer())
      .get(`/users/${INVALID_ID}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should return a user with status code 200 and user data', async () => {
    const newUser = await userService.create(userMock);

    return request(app.getHttpServer())
      .get(`/users/${newUser.id}`)
      .expect(HttpStatus.OK)
      .then((res) => {
        const { id, name, email } = res.body;

        expect(id).toBe(newUser.id);
        expect(name).toBe('Uzumaki Naruto');
        expect(email).toBe('naruto@uzumaki.com.br');
      });
  });

  it('should return a user and status 201 when post a user', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(userMock)
      .expect(HttpStatus.CREATED)
      .then((res) => {
        const { id, name, email, hashPassword, createdAt } = res.body;

        expect(id).toBeDefined();
        expect(createdAt).toBeDefined();
        expect(hashPassword).toBeDefined();
        expect(name).toBe('Uzumaki Naruto');
        expect(email).toBe('naruto@uzumaki.com.br');
      });
  });

  it('should throw bad request exception when try to create a user with the same email', async () => {
    await userService.create(userMock);

    return request(app.getHttpServer())
      .post('/users')
      .send(userMock)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should throw not found exception when try to update a user with invalid id', () => {
    return request(app.getHttpServer())
      .put(`/customers/${INVALID_ID}`)
      .send(userMock)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should return user updated and status 200 when update a user', async () => {
    const newUser = await userService.create(userMock);

    return request(app.getHttpServer())
      .put(`/users/${newUser.id}`)
      .send({ email: 'teste@teste.com.br', password: '54321' })
      .expect(HttpStatus.OK)
      .then((res) => {
        const { email, hashPassword } = res.body;

        expect(hashPassword).not.toBe(newUser.hashPassword);
        expect(email).toBe('teste@teste.com.br');
      });
  });
});
