import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//Import Packages
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { ReservationModule } from './reservation/reservation.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI), ProductModule, CartModule, ReservationModule, SharedModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
