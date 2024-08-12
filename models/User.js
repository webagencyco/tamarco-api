import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  accountNumber: { type: String, unique: true },
  street: { type: String },
  townCity: { type: String },
  county: { type: String },
  postCode: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = model('User', UserSchema);
export default User;
