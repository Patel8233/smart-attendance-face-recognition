import { ApiProperty } from '@nestjs/swagger';

export class CreateClassSessionDto {
  @ApiProperty({
    example: 'CS-601',
  })
  subjectCode: string;
}