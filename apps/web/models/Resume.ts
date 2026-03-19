import mongoose, { Schema, model, models } from 'mongoose';

const ResumeSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  resumeText: { type: String, required: true },
  fileUrl: { type: String }, // Store local path or cloud URL
  fileName: { type: String },
  content: { type: Buffer }, // Store binary content for email attachment
}, { timestamps: true });

const Resume = models.Resume || model('Resume', ResumeSchema);

export default Resume;
