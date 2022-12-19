import User from '../../models/User.model';
import {
  MutationRegisterArgs,
  UserFieldsFragment,
  MutationResolvers as UserMutation,
  User as IUser,
  MutationLoginArgs,
  MutationForgotPasswordArgs,
} from '../../__generated__/generated';
import emailRepository from '../../documents/emailRepository';

async function users(): Promise<IUser[]> {
  const users = await User.find();
  return users;
}

function generateDigits() {
  return (Math.floor(Math.random() * 900000) + 100000).toString();
}
/**
 * @description: Register new user and send confirmation code to user email
 * @param _:any
 * @param {type MutationRegisterArgs} { name, email, password, phone }
 * @returns
 */
async function register(
  _: any,
  { name, email, password, phone }: MutationRegisterArgs
): Promise<UserFieldsFragment> {
  const isExist = await User.findOne({ email }).exec();
  if (isExist) throw new Error('User Already Exist');
  const user = new User({
    name,
    email,
    password,
    phone,
    isConfirmed: false,
  });
  const hashed_password = await user.encryptPassword(password);
  user.password = hashed_password;
  // const confirmEmailToken = await user.getConfirmEmailToken();
  user.confirmationCode = generateDigits();
  // generate token and save it to database
  user.getConfirmEmailToken();
  // send confirmation code to user email
  await emailRepository.sendConfirmEmail(user.email, user.confirmationCode);
  const newUser = await user.save();
  return newUser;
}
/**
 * Confirm code and set isConfirmed to true if code is valid and user is found by email address in database
 * @param {type string} code
 * @param {type string} email
 * @returns
 */
async function confirmCode(
  _: any,
  {
    code: confirmationCode,
    email,
  }: {
    code: string;
    email: string;
  }
) {
  const user = await User.findOne({
    email,
  }).exec();
  if (!user) throw new Error('User not found');
  const isExpired = (user.confirmEmailExpire as any) < Date.now();
  if (isExpired) throw new Error('Token is expired & please generate new one');
  if (user.confirmationCode !== confirmationCode)
    throw new Error('Invalid code');
  user.isConfirmed = true;
  user.confirmationCode = undefined;
  user.confirmEmailExpire = undefined;
  user.confirmEmailToken = undefined;
  await user.save();
  return user;
}

/**
 * @description: Resend confirmation code to user email
 * @param {type string} email
 * @return {*}
 */
async function resendCode(_: any, { email }: { email: string }) {
  const user = await User.findOne({ email }).exec();
  if (!user) throw new Error('User not found');
  if (user.isConfirmed) throw new Error('User is already confirmed');
  // generate token and save it to database
  user.confirmationCode = generateDigits();
  user.getConfirmEmailToken();
  // send confirmation code to user email again
  await emailRepository.sendConfirmEmail(user.email, user.confirmationCode);
  await user.save();
  return user;
}

/**
 * @description: Login user and generate token
 * @param {type MutationLoginArgs} { email, password }
 */
async function login(_: any, { email, password }: MutationLoginArgs) {
  const user = await User.findOne({
    email,
  }).exec();
  if (!user) throw new Error('User not found');
  if (!user.isConfirmed) throw new Error('User is not confirmed');
  const isMatch = await user.comparePassword(password, user.password);
  if (!isMatch) throw new Error('Invalid password');
  const token = await user.generateToken(user._id);
  return {
    token,
    user,
  };
}

/**
 * @description: Reset password and send reset password link to user email address
 * @param {type string} email
 * @return {*}
 */
async function resetPassword(_: any, { email }: { email: string }) {
  const user = await User.findOne({
    email,
  }).exec();
  if (!user) throw new Error('User not found');
  if (!user.isConfirmed) throw new Error('User is not confirmed');
  const resetToken = await user.getResetPasswordToken();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = (Date.now() + 10 * 60 * 1000) as any;
  await user.save();
  const uri = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;
  await emailRepository.sendResetPasswordEmail(user.email, uri);
  return user;
}

/**
 * @description: Forgot password
 * @param {type string} { email, resetToken }
 * @return {*}
 */
async function forgotPassword(
  _: any,
  { password, resetToken }: MutationForgotPasswordArgs
) {
  const isFound = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).exec();
  if (!isFound) throw new Error('Token is invalid or expired');
  const user = isFound;
  const hashed_password = await user.encryptPassword(password);
  user.password = hashed_password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  return user;
}

const Query = {
  users,
};

const Mutation: UserMutation = {
  register,
  confirmCode,
  resendCode,
  login,
  resetPassword,
  forgotPassword,
};

export default {
  UserQuery: Query,
  UserMutation: Mutation,
};
