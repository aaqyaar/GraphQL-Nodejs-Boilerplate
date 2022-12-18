import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  isConfirmed: boolean;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  confirmEmailToken?: string;
  confirmEmailExpire?: Date;
  confirmationCode?: string;
  encryptPassword: (value: string) => string;
  comparePassword: (value: string, enteredPassword: string) => boolean;
  getResetPasswordToken: () => string;
  getConfirmEmailToken: () => string;
  generateToken: (_id: string) => string;
}

const schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    confirmEmailToken: String,
    confirmEmailExpire: Date,
    confirmationCode: String,
  },
  {
    timestamps: true,
  }
);

schema.methods.encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

schema.methods.comparePassword = async (
  password: string,
  hashed_password: string
): Promise<boolean> => {
  return await bcrypt.compareSync(password, hashed_password);
};

schema.methods.getResetPasswordToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // expires 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

schema.methods.getConfirmEmailToken = function (): string {
  const confirmEmailToken = crypto.randomBytes(20).toString('hex');
  this.confirmEmailToken = crypto
    .createHash('sha256')
    .update(confirmEmailToken)
    .digest('hex');
  // expires 10 minutes
  this.confirmEmailExpire = Date.now() + 10 * 60 * 1000;
  return confirmEmailToken;
};

schema.methods.generateToken = function (_id: string): string {
  return jwt.sign({ _id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = model<IUser>('User', schema);
export default User;
