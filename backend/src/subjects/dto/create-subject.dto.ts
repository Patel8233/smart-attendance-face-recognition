import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty({
    example: 'Machine Learning',
  })
  name: string;

  @ApiProperty({
    example: 'CS-601',
  })
  code: string;

  @ApiProperty({
    example: 'CSE Data Science',
  })
  branch: string;

  @ApiProperty({
    example: 7,
  })
  semester: number;
}