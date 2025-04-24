import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../entities/user.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private user: Model<User>,
    private jwt: JwtService,
  ) {}

  async findUser(gmail: string) {
    try {
      let bazaUser = await this.user.findOne({ gmail });
      return bazaUser;
    } catch (error) {
      console.error('Error finding user:', error);
      throw new InternalServerErrorException('Error finding user');
    }
  }

  async register(data: CreateUserDto) {
    try {
      let user = await this.findUser(data.gmail);
      if (user) {
        throw new BadRequestException('User already exists');
      }

      let hash = bcrypt.hashSync(data.password, 7);

      let newUser = await this.user.create({
        name: data.name,
        password: hash,
        gmail: data.gmail,
        role: data.role,
      });

      return newUser;
    } catch (error) {
      console.error('Error during user registration:', error);
      throw error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Error registering user');
    }
  }

  async login(data: CreateUserDto) {
    try {
      let user = await this.findUser(data.gmail);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      let match = bcrypt.compareSync(data.password, user.password);
      if (!match) {
        throw new BadRequestException('Wrong password');
      }

      let token = this.jwt.sign({ id: user._id });
      return { token };
    } catch (error) {
      console.error('Error during login:', error);
      throw error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Error during login');
    }
  }
}

// dars 32 daqiqasida qoldi qolganini yetkazib olish kerak
