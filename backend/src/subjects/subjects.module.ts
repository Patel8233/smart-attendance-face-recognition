import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Subject,
  SubjectSchema,
} from './schemas/subject.schema';

import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Subject.name,
        schema: SubjectSchema,
      },
    ]),

    AuthModule,
  ],

  controllers: [SubjectsController],

  providers: [SubjectsService],

  exports: [SubjectsService],
})
export class SubjectsModule {}