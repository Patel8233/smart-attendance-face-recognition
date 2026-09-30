import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';

import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

import {
  Attendance,
  AttendanceSchema,
} from './schemas/attendance.schema';

import { StudentsModule } from '../students/students.module';
import { SubjectsModule } from '../subjects/subjects.module';
import { ClassSessionsModule } from '../class-sessions/class-sessions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Attendance.name,
        schema: AttendanceSchema,
      },
    ]),

    StudentsModule,
    SubjectsModule,
    ClassSessionsModule,
    AuthModule,

    HttpModule,
  ],

  controllers: [AttendanceController],

  providers: [AttendanceService],
})
export class AttendanceModule {}