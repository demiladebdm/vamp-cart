import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from '../shared/shared.module';
import { OrderSchema } from '../models/order.schema';
import { ProductModule } from '../product/product.module';
import { ProductSchema } from '../models/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Reservation', schema: OrderSchema }, { name: 'Product', schema: ProductSchema }]),
    ProductModule,
    SharedModule
  ],
  providers: [ReservationService],
  controllers: [ReservationController]
})
export class ReservationModule { }
