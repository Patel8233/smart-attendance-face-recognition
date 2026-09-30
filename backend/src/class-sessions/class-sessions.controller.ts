import {
  Body,
  Controller,
  UseGuards,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

import { ClassSessionsService } from './class-sessions.service';

import { CreateClassSessionDto } from './dto/create-class-session.dto';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Class Sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('class-sessions')
export class ClassSessionsController {
  constructor(
    private readonly classSessionsService:
      ClassSessionsService,
  ) {}

  @Roles('admin', 'teacher')
@Post()
  create(
    @Body()
    createClassSessionDto: CreateClassSessionDto,
  ) {
    return this.classSessionsService.create(
      createClassSessionDto,
    );
  }
  @Roles('admin', 'teacher')
@Patch(':id/end')
endSession(
  @Param('id')
  id: string,
) {
  return this.classSessionsService.endSession(
    id,
  );
}
@Get()
findAll() {
  return this.classSessionsService.findAll();
}
}