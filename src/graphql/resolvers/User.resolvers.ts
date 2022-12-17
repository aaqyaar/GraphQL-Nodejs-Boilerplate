import User from '../../models/User.model';
import {
  MutationRegisterArgs,
  UserFieldsFragment,
  MutationResolvers as UserMutation,
  User as IUser,
} from '../../__generated__/generated';

async function users(): Promise<IUser[]> {
  const users = await User.find();
  return users;
}

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
  });
  const hashed_password = await user.encryptPassword(password);
  user.password = hashed_password;
  const newUser = await user.save();
  return newUser;
}

const Query = {
  users,
};

const Mutation: UserMutation = {
  register,
};

export default {
  UserQuery: Query,
  UserMutation: Mutation,
};
