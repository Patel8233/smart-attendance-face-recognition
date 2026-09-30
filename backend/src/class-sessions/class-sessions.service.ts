import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ClassSession,
  ClassSessionDocument,
} from './schemas/class-session.schema';

import { SubjectsService } from '../subjects/subjects.service';

import { CreateClassSessionDto } from './dto/create-class-session.dto';

@Injectable()
export class ClassSessionsService {
  constructor(
    @InjectModel(ClassSession.name)
    private readonly classSessionModel:
      Model<ClassSessionDocument>,

    private readonly subjectsService:
      SubjectsService,
  ) {}

  async create(
    createClassSessionDto: CreateClassSessionDto,
  ): Promise<ClassSession> {

    const subject =
      await this.subjectsService.findByCode(
        createClassSessionDto.subjectCode,
      );

    if (!subject) {
      throw new NotFoundException(
        'Subject not found',
      );
    }

    const now = new Date();

    const date = now.toLocaleDateString(
      'en-CA',
      {
        timeZone: 'Asia/Kolkata',
      },
    );

    const startTime = now.toLocaleTimeString(
      'en-IN',
      {
        timeZone: 'Asia/Kolkata',
      },
    );

    const classSession =
      new this.classSessionModel({
        subjectCode: subject.code,
        subjectName: subject.name,
        branch: subject.branch,
        semester: subject.semester,
        date,
        startTime,
        active: true,
      });

    return classSession.save();
  }
  async findById(
  id: string,
): Promise<ClassSession | null> {
  return this.classSessionModel
    .findById(id)
    .exec();
}
async endSession(
  id: string,
): Promise<ClassSession> {

  const session =
    await this.classSessionModel
      .findById(id)
      .exec();

  if (!session) {
    throw new NotFoundException(
      'Class session not found',
    );
  }

  if (!session.active) {
    throw new BadRequestException(
      'Class session is already ended',
    );
  }

  const now = new Date();

  const endTime = now.toLocaleTimeString(
    'en-IN',
    {
      timeZone: 'Asia/Kolkata',
    },
  );

  session.endTime = endTime;
  session.active = false;

  return session.save();
}
async findAll(): Promise<ClassSession[]> {
  return this.classSessionModel
    .find()
    .sort({ createdAt: -1 })
    .exec();
}
async countBySubject(
  subjectCode: string,
): Promise<number> {
  return this.classSessionModel
    .countDocuments({
      subjectCode,
      active: false,
    })
    .exec();
}
async getCompletedSessionIds(
  subjectCode: string,
): Promise<string[]> {
  const sessions =
    await this.classSessionModel
      .find({
        subjectCode,
        active: false,
      })
      .select('_id')
      .exec();

  return sessions.map(
    (session) => session._id.toString(),
  );
}
}