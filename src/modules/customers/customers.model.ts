import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ versionKey: false, timestamps: { updatedAt: false } })
export class Customer {
  @Prop()
  name: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  email: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
