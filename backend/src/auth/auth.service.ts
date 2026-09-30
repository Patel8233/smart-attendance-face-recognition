import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

import {
  User,
  UserDocument,
} from './schemas/user.schema';

import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
  @InjectModel(User.name)
  private readonly userModel:
    Model<UserDocument>,

  private readonly jwtService: JwtService,
) {}

  async register(
    registerDto: RegisterDto,
  ) {
    const email =
      registerDto.email
        .trim()
        .toLowerCase();

    const existingUser =
      await this.userModel
        .findOne({ email })
        .exec();

    if (existingUser) {
      throw new ConflictException(
        'Email already registered',
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        registerDto.password,
        10,
      );

    const user =
      new this.userModel({
        name: registerDto.name,
        email,
        password: hashedPassword,
        role: 'teacher',
      });

    const savedUser =
      await user.save();

    return {
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
    };
  }
  async login(loginDto: LoginDto) {
  const email =
    loginDto.email
      .trim()
      .toLowerCase();

  const user =
    await this.userModel
      .findOne({ email })
      .exec();

  if (!user || !user.active) {
    throw new UnauthorizedException(
      'Invalid email or password',
    );
  }

  const passwordMatched =
    await bcrypt.compare(
      loginDto.password,
      user.password,
    );

  if (!passwordMatched) {
    throw new UnauthorizedException(
      'Invalid email or password',
    );
  }

  const payload = {
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken =
    await this.jwtService.signAsync(payload);

  return {
    message: 'Login successful',
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
}