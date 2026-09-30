import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AttendanceDocument = HydratedDocument<Attendance>;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ required: true })
  enrollmentNumber: string;

  @Prop({ required: true })
  studentName: string;

  @Prop({ required: true })
sessionId: string;
  
@Prop({ required: true })
subjectCode: string;

@Prop({ required: true })
subjectName: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  time: string;

  @Prop({ default: 'Present' })
  status: string;

  @Prop({ default: 'Face Recognition' })
  markedBy: string;
}

export const AttendanceSchema =
  SchemaFactory.createForClass(Attendance);