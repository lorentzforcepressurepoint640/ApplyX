import mongoose, { Schema, model, models } from 'mongoose';

const SentEmailSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  threadId: { type: String },
  messageId: { type: String },
  status: { type: String, default: 'sent' },
}, { timestamps: true });

const SentEmail = models.SentEmail || model('SentEmail', SentEmailSchema);

export default SentEmail;
