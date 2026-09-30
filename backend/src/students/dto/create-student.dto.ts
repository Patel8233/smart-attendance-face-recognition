import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ example: 'Rahul Sharma' })
  name: string;

  @ApiProperty({ example: 'rahul@gmail.com' })
  email: string;

  @ApiProperty({ example: '0827CS221001' })
  enrollmentNumber: string;

  @ApiProperty({ example: 'CSE Data Science' })
  branch: string;

  @ApiProperty({ example: 6 })
  semester: number;

  @ApiPropertyOptional({ example: 'A' })
  section?: string;

  @ApiPropertyOptional({ example: '9876543210' })
  phone?: string;
}