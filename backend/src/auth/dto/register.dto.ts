import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Teacher Name',
  })
  name: string;

  @ApiProperty({
    example: 'teacher@example.com',
  })
  email: string;

  @ApiProperty({
    example: 'StrongPassword123',
  })
  password: string;
}