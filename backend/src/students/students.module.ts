import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

import {
  Student,
  StudentSchema,
} from './schemas/student.schema';

import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Student.name,
        schema: StudentSchema,
      },
    ]),

    HttpModule,
    AuthModule,
  ],

  controllers: [StudentsController],

  providers: [StudentsService],

  exports: [StudentsService],
})
export class StudentsModule {}