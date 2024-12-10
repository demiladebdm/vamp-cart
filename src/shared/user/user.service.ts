import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDTO, RegisterDTO } from '../../auth/auth.dto';
import { User } from '../../types/user';
import * as bcrypt from 'bcrypt';
import { Payload } from '../../types/payload';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) { }

  private sanitizaUser(user: User) {
    const sanitized = user.toObject();
    // delete sanitized.password;
    // delete sanitized.__v;
    const exclude = ['password', '__v']
    exclude.forEach((i) => delete sanitized[i])
    return sanitized;
  }

  async create(userDTO: RegisterDTO) {
    const { username } = userDTO;
    const user = await this.userModel.findOne({ username });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
    }

    const createdUser = new this.userModel(userDTO);
    await createdUser.save();
    return this.sanitizaUser(createdUser);
  }

  async findByLogin(userDTO: LoginDTO) {
    const { username, password } = userDTO;
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED)
    }

    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizaUser(user);
    } else {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED)
    }
  }

  async findByPayload(payload: Payload){
    const { username } = payload;
    return await this.userModel.findOne({username});
  }
}
