import UserResolvers from './User.resolvers';

export default {
  Query: {
    ...UserResolvers.UserQuery,
  },
  Mutation: {
    ...UserResolvers.UserMutation,
  },
};
