import User from '../../models/User.model';
import {
  MutationRegisterArgs,
  UserFieldsFragment,
  MutationResolvers as UserMutation,
  User as IUser,
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

const Query = {
  users,
};

const Mutation: UserMutation = {
  register,
  confirmCode,
  resendCode,
};

export default {
  UserQuery: Query,
  UserMutation: Mutation,
};
