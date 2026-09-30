import {
  Body,
  Controller,
  UseGuards,
  Get,
  Post,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Subjects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subjects')
export class SubjectsController {
  constructor(
    private readonly subjectsService: SubjectsService,
  ) {}

  @Roles('admin')
@Post()
  create(
    @Body() createSubjectDto: CreateSubjectDto,
  ) {
    return this.subjectsService.create(
      createSubjectDto,
    );
  }
  @Get()
findAll() {
  return this.subjectsService.findAll();
}
}