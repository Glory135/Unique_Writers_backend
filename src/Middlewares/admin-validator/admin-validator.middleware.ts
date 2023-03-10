import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import {NextFunction} from 'express';

@Injectable()
export class AdminValidatorMiddleware implements NestMiddleware {
  use(req: any, res: any, next: NextFunction) {
    const user = req.user;
    if(!user.isAdmin){
      throw new UnauthorizedException('Not An Admin!!!')
    }
    next()
  }
}
