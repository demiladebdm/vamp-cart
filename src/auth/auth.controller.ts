import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../shared/user/user.service';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Payload } from '../types/payload';
import { User } from '../utilities/user.decorator';
import { SellerGuard } from '../guards/seller.guard';

@Controller('auth')
export class AuthController {

  constructor(private userService: UserService, private authService: AuthService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'), SellerGuard)
  tempAuth() {
    return { auth: 'works' }
  }

  //For Dev-Testing
  async findAll(@User() user: any) {
    console.log("User", user)
    return await this.userService.findAll();
  }

  @Post('login')
  async login(@Body() userDTO: LoginDTO) {
    const user = await this.userService.findByLogin(userDTO)
    const payload: Payload = {
      username: user.username,
      seller: user.seller
    }

    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Post('register')
  async register(@Body() userDTO: RegisterDTO) {
    const user = await this.userService.create(userDTO)
    const payload: Payload = {
      username: user.username,
      seller: user.seller
    }

    const token = await this.authService.signPayload(payload);
    return { user, token };
  }
}
