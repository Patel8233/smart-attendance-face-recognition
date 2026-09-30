import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubjectDocument = HydratedDocument<Subject>;

@Schema({ timestamps: true })
export class Subject {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  branch: string;

  @Prop({ required: true })
  semester: number;

  @Prop({ default: true })
  active: boolean;
}

export const SubjectSchema =
  SchemaFactory.createForClass(Subject);