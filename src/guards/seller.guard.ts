import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class SellerGuard implements CanActivate {

  constructor() { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (user && user.seller) {
      return true
    }

    throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED)
  }
}