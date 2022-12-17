import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  encryptPassword: (value: string) => string;
  isMatchPassword: (value: string, enteredPassword: string) => boolean;
  getResetPasswordToken: () => string;
}

const schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

schema.methods.encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

schema.methods.isMatchPassword = async (
  password: string,
  enteredPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, enteredPassword);
};

schema.methods.getResetPasswordToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = model<IUser>('User', schema);
export default User;
