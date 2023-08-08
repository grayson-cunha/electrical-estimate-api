import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Customer extends Model {
  @Column
  name: string;

  @Column
  phoneNumber: string;

  @Column
  email: string;
}
