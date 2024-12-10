import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [SharedModule],
  controllers: [AuthController],
  exports: [],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
