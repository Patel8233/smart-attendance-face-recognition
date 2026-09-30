import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type ClassSessionDocument =
  HydratedDocument<ClassSession>;

@Schema({ timestamps: true })
export class ClassSession {

  @Prop({ required: true })
  subjectCode: string;

  @Prop({ required: true })
  subjectName: string;

  @Prop({ required: true })
  branch: string;

  @Prop({ required: true })
  semester: number;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  startTime: string;

  @Prop()
  endTime: string;

  @Prop({ default: true })
  active: boolean;
}

export const ClassSessionSchema =
  SchemaFactory.createForClass(ClassSession);