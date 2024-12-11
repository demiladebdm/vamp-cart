import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    const response = { hello: 'Hello World!' };
    return response
  }
}
