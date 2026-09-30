import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true })
export class Student {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  enrollmentNumber: string;

  @Prop({ required: true })
  branch: string;

  @Prop({ required: true })
  semester: number;

  @Prop()
  section: string;

  @Prop()
  phone: string;

  @Prop({ default: false })
  faceRegistered: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);