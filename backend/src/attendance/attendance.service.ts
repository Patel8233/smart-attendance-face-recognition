import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';

import {
  Attendance,
  AttendanceDocument,
} from './schemas/attendance.schema';

import { StudentsService } from '../students/students.service';
import { SubjectsService } from '../subjects/subjects.service';
import { ClassSessionsService } from '../class-sessions/class-sessions.service';

@Injectable()
export class AttendanceService {
  constructor(
  @InjectModel(Attendance.name)
  private readonly attendanceModel: Model<AttendanceDocument>,

  private readonly studentsService: StudentsService,

  private readonly subjectsService: SubjectsService,

  private readonly classSessionsService:
  ClassSessionsService,

  private readonly httpService: HttpService,
) {}

 async markAttendance(
  enrollmentNumber: string,
  sessionId: string,
): Promise<Attendance> {

  const student =
    await this.studentsService.findByEnrollmentNumber(
      enrollmentNumber,
    );

  if (!student) {
    throw new NotFoundException(
      'Student not found',
    );
  }

  const session =
    await this.classSessionsService.findById(
      sessionId,
    );

  if (!session) {
    throw new NotFoundException(
      'Class session not found',
    );
  }

  if (!session.active) {
    throw new BadRequestException(
      'Class session is not active',
    );
  }

  const now = new Date();

  const date = now.toLocaleDateString(
    'en-CA',
    {
      timeZone: 'Asia/Kolkata',
    },
  );

  const time = now.toLocaleTimeString(
    'en-IN',
    {
      timeZone: 'Asia/Kolkata',
    },
  );

  const existingAttendance =
    await this.attendanceModel
      .findOne({
        enrollmentNumber:
          student.enrollmentNumber,
        sessionId: sessionId,
      })
      .exec();

  if (existingAttendance) {
    throw new ConflictException(
      'Attendance already marked for this class session',
    );
  }

  const attendance =
    new this.attendanceModel({
      enrollmentNumber:
        student.enrollmentNumber,

      studentName:
        student.name,

      subjectCode:
        session.subjectCode,

      subjectName:
        session.subjectName,

      sessionId:
        sessionId,

      date,
      time,

      status: 'Present',

      markedBy:
        'Face Recognition',
    });

  return attendance.save();
}
async recognizeAndMarkAttendance(
  file: any,
  sessionId: string,
) {
  const formData = new FormData();

  const bytes = new Uint8Array(file.buffer);

  const blob = new Blob(
    [bytes],
    { type: file.mimetype },
  );

  formData.append(
    'file',
    blob,
    file.originalname,
  );

  const response = await firstValueFrom(
    this.httpService.post(
      'http://127.0.0.1:8000/recognize-face',
      formData,
    ),
  );

  const result = response.data;

  if (!result.recognized) {
    throw new BadRequestException(
      result.message || 'Face not recognized',
    );
  }

 return this.markAttendance(
  result.enrollmentNumber,
  sessionId,
);
}
  async findAll(): Promise<Attendance[]> {
    return this.attendanceModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }
  async findBySubject(
  subjectCode: string,
): Promise<Attendance[]> {
  return this.attendanceModel
    .find({ subjectCode })
    .sort({ createdAt: -1 })
    .exec();
}
  
async findByStudent(
  enrollmentNumber: string,
): Promise<Attendance[]> {
  return this.attendanceModel
    .find({ enrollmentNumber })
    .sort({ createdAt: -1 })
    .exec();
}
async getAttendanceReport(
  enrollmentNumber: string,
  subjectCode: string,
) {
  const student =
    await this.studentsService.findByEnrollmentNumber(
      enrollmentNumber,
    );

  if (!student) {
    throw new NotFoundException(
      'Student not found',
    );
  }

  const subject =
    await this.subjectsService.findByCode(
      subjectCode,
    );

  if (!subject) {
    throw new NotFoundException(
      'Subject not found',
    );
  }

  const totalClasses =
    await this.classSessionsService.countBySubject(
      subjectCode,
    );

  const completedSessionIds =
  await this.classSessionsService
    .getCompletedSessionIds(subjectCode);

const presentClasses =
  await this.attendanceModel.countDocuments({
    enrollmentNumber,
    subjectCode,
    sessionId: {
      $in: completedSessionIds,
    },
  });

  const absentClasses = Math.max(
    totalClasses - presentClasses,
    0,
  );

  const attendancePercentage =
    totalClasses > 0
      ? Number(
          (
            (presentClasses / totalClasses) *
            100
          ).toFixed(2),
        )
      : 0;

  return {
    enrollmentNumber,
    studentName: student.name,
    subjectCode: subject.code,
    subjectName: subject.name,
    totalClasses,
    presentClasses,
    absentClasses,
    attendancePercentage,
  };
}
}