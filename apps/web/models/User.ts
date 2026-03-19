import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  apiKey: { type: String, unique: true, sparse: true },
  portfolioUrl: { type: String, default: "" },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);

export default User;
