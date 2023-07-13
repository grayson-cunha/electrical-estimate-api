import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: { updatedAt: false } })
export class User {
  @Prop()
  name: string;

  @Prop()
  hashPassword: string;

  @Prop()
  email: string;

  @Prop()
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
