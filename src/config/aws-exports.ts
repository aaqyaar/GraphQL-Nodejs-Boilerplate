export const awsExports = {
  config: {
    apiVersion: '2020-08-15',
    region: process.env.AWS_REGION,
  },
  auth: {
    clientId: process.env.AWS_CLIENT_ID,
    clientSecret: process.env.AWS_CLIENT_SECRET,
    userPoolId: process.env.AWS_USER_POOL_ID,
  },
};
