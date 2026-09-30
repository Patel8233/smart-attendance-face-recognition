import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { RolesGuard } from './roles/roles.guard';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import {
  User,
  UserSchema,
} from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => ({
        secret:
          configService.getOrThrow<string>(
            'JWT_SECRET',
          ),

        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],

  controllers: [AuthController],

 providers: [
  AuthService,
  JwtAuthGuard,
  RolesGuard,
],

 exports: [
  AuthService,
  JwtModule,
  JwtAuthGuard,
  RolesGuard,
],
})
export class AuthModule {}