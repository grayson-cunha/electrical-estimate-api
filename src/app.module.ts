import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { CustomersModule } from './modules/customers/customers.module';

@Module({
  imports: [ConfigurationModule, CustomersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
