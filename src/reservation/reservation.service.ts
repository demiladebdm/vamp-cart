import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateReservationDTO } from './reservation.dto';
import { Order } from '../types/order';
import { Model } from 'mongoose';
import { Product } from '../types/product';

@Injectable()
export class ReservationService {
  // private readonly HOLDING_TIME = 10 * 60 * 1000;
  private readonly HOLDING_TIME = 1 * 60 * 1000;

  constructor(
    @InjectModel('Reservation') private reservationModel: Model<Order>,
    @InjectModel('Product') private productModel: Model<Product>,
  ) { }

  async listReservationsByUser(userId: string) {
    await this.releaseExpiredReservations();

    const orders = await this.reservationModel
      .find({ owner: userId, status: 'active' })
      .populate('owner')
      .populate('products.product');

    if (!orders.length) {
      throw new HttpException('No Orders Found', HttpStatus.NO_CONTENT);
    }
    return orders;
  }

  async createReservation(orderDTO: CreateReservationDTO, userId: string) {
    const session = await this.productModel.db.startSession();
    session.startTransaction();

    try {
      await this.releaseExpiredReservations();

      for (const item of orderDTO.products) {
        const product = await this.getProduct(item.product, session);

        if (item.quantity > product.count - product.reserved) {
          throw new HttpException(
            `Insufficient stock for product: ${product.title}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        product.reserved += item.quantity;
        await product.save({ session });
      }

      const createOrder = {
        owner: userId,
        products: orderDTO.products,
        reservationTime: new Date(),
        status: 'active',
      };

      const order = await this.reservationModel.create([createOrder], { session });

      await session.commitTransaction();
      return order[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  private async releaseExpiredReservations() {
    const expiredTime = new Date(Date.now() - this.HOLDING_TIME);

    const expiredReservations = await this.reservationModel.find({
      status: 'active',
      reservationTime: { $lt: expiredTime },
    });

    for (const reservation of expiredReservations) {
      reservation.status = 'expired';
      await reservation.save();

      for (const productItem of reservation.products) {
        const product = await this.productModel.findById(productItem.product);
        if (product) {
          product.reserved -= productItem.quantity;
          await product.save();
        }
      }
    }
  }

  private async getProduct(productId: string, session: any) {
    const product = await this.productModel.findById(productId).session(session);

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }
}