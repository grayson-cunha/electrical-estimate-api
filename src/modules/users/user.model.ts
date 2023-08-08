import { Column, CreatedAt, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  name: string;

  @Column
  hashPassword: string;

  @Column
  email: string;

  @CreatedAt
  createdAt: Date;
}
