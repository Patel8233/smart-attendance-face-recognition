import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';

import {
  Student,
  StudentDocument,
} from './schemas/student.schema';

import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,

    private readonly httpService: HttpService,
  ) {}

  async create(
    createStudentDto: CreateStudentDto,
  ): Promise<Student> {
    const student = new this.studentModel(
      createStudentDto,
    );

    return student.save();
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }

  async findOne(
    id: string,
  ): Promise<Student | null> {
    return this.studentModel
      .findById(id)
      .exec();
  }

  async findByEnrollmentNumber(
    enrollmentNumber: string,
  ): Promise<Student | null> {
    return this.studentModel
      .findOne({ enrollmentNumber })
      .exec();
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student | null> {
    return this.studentModel
      .findByIdAndUpdate(
        id,
        updateStudentDto,
        { new: true },
      )
      .exec();
  }

  async registerFace(
    enrollmentNumber: string,
    file: any,
  ) {
    const student =
      await this.findByEnrollmentNumber(
        enrollmentNumber,
      );

    if (!student) {
      throw new NotFoundException(
        'Student not found',
      );
    }

    if (!file) {
      throw new BadRequestException(
        'Face image is required',
      );
    }

    const formData = new FormData();

    const bytes = new Uint8Array(
      file.buffer,
    );

    const blob = new Blob(
      [bytes],
      {
        type: file.mimetype,
      },
    );

    formData.append(
      'file',
      blob,
      file.originalname,
    );

    const response = await firstValueFrom(
      this.httpService.post(
        `http://127.0.0.1:8000/register-face/${enrollmentNumber}`,
        formData,
      ),
    );

    const result = response.data;

    if (!result.success) {
      throw new BadRequestException(
        result.message ||
          'Face registration failed',
      );
    }

    await this.studentModel
  .findOneAndUpdate(
    {
      enrollmentNumber: enrollmentNumber,
    },
    {
      faceRegistered: true,
    },
    {
      new: true,
    },
  )
  .exec();

    return result;
  }

  async remove(
    id: string,
  ): Promise<Student | null> {
    return this.studentModel
      .findByIdAndDelete(id)
      .exec();
  }
}