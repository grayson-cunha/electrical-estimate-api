import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `${process.env.DATABASE_URL_BASE}${process.env.DATABASE_NAME}`,
    ),
  ],
})
export class ConfigurationModule {}
