import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Subject,
  SubjectDocument,
} from './schemas/subject.schema';

import { CreateSubjectDto } from './dto/create-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name)
    private readonly subjectModel: Model<SubjectDocument>,
  ) {}

 async create(
  createSubjectDto: CreateSubjectDto,
): Promise<Subject> {
  const subject = new this.subjectModel(
    createSubjectDto,
  );

  return subject.save();
}
async findAll(): Promise<Subject[]> {
  return this.subjectModel
    .find()
    .sort({ createdAt: -1 })
    .exec();
}
async findByCode(
  code: string,
): Promise<Subject | null> {
  return this.subjectModel
    .findOne({ code })
    .exec();
}
}