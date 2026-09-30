import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';

import { ClassSessionsController } from './class-sessions.controller';
import { ClassSessionsService } from './class-sessions.service';

import {
  ClassSession,
  ClassSessionSchema,
} from './schemas/class-session.schema';

import { SubjectsModule } from '../subjects/subjects.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ClassSession.name,
        schema: ClassSessionSchema,
      },
    ]),

    SubjectsModule,
    AuthModule,
  ],

  controllers: [ClassSessionsController],

  providers: [ClassSessionsService],

  exports: [ClassSessionsService],
})
export class ClassSessionsModule {}