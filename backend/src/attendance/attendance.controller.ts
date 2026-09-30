import {
  Body,
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes,ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

import { AttendanceService } from './attendance.service';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
  ) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
       enrollmentNumber: {
        type: 'string',
       example: '0808DS231131',
       },
       sessionId: {
          type: 'string',
          example: 'CS-601',
        },
      },
       required: [
         'enrollmentNumber',
         'subjectCode',
        ],
    },
  })
  markAttendance(
  @Body()
  body: {
  enrollmentNumber: string;
  sessionId: string;
}
) {
 return this.attendanceService.markAttendance(
  body.enrollmentNumber,
  body.sessionId,
);
}
@Post('recognize')
@UseInterceptors(FileInterceptor('file'))
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
      sessionId: {
        type: 'string',
        example: 'CS-601',
      },
    },
    required: [
      'file',
      'subjectCode',
    ],
  },
})
recognizeAndMarkAttendance(
  @UploadedFile() file: any,

  @Body('sessionId')
  sessionId: string,
) {
  return this.attendanceService
    .recognizeAndMarkAttendance(
      file,
      sessionId,
    );
}
  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get('subject/:subjectCode')
findBySubject(
  @Param('subjectCode')
  subjectCode: string,
) {
  return this.attendanceService.findBySubject(
    subjectCode,
  );
}
@Get('student/:enrollmentNumber')
findByStudent(
  @Param('enrollmentNumber')
  enrollmentNumber: string,
) {
  return this.attendanceService.findByStudent(
    enrollmentNumber,
  );
}
@Get('report/:enrollmentNumber/:subjectCode')
getAttendanceReport(
  @Param('enrollmentNumber')
  enrollmentNumber: string,

  @Param('subjectCode')
  subjectCode: string,
) {
  return this.attendanceService.getAttendanceReport(
    enrollmentNumber,
    subjectCode,
  );
}
}