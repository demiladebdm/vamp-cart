import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../models/user.schema';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExtensionFilter } from './http-exception.filter';
import { LogginInterceptor } from './loggin.interceptor';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [
    UserService,
    {
      provide: APP_FILTER,
      useClass: HttpExtensionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogginInterceptor
    }
  ],
  exports: [UserService, MongooseModule]
})

export class SharedModule { }
