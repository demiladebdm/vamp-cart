import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { User } from '../utilities/user.decorator';
import { User as UserDocument } from '../types/user';
import { AuthGuard } from '@nestjs/passport';
import { CreateReservationDTO } from './reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  listOrders(@User() { id }: UserDocument) {
    return this.reservationService.listReservationsByUser(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createOrder(@Body() order: CreateReservationDTO, @User() { id }: UserDocument) {
    return this.reservationService.createReservation(order, id);
  }
}
