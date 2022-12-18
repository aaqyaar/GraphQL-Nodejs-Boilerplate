import AWS from 'aws-sdk';
import crypto from 'crypto';
import { awsExports } from '../config/aws-exports';

const { config, auth } = awsExports;

const cognitoIdentity = new AWS.CognitoIdentityServiceProvider({
  // apiVersion: config.apiVersion,
  region: config.region,
});

export default class AWSAuth {
  private static ClientId = auth.clientId as string;
  private static Secret = auth.clientSecret as string;
  /**
   * hash secret
   */
  private static hashSecret(email: string): string {
    return crypto
      .createHmac('SHA256', AWSAuth.Secret)
      .update(email + AWSAuth.ClientId)
      .digest('base64');
  }

  /**
   * register to aws cognito
   */
  async register(
    email: string,
    password: string,
    userAttr: Array<any>
  ): Promise<any> {
    const params = {
      ClientId: AWSAuth.ClientId,
      Username: email,
      Password: password,
      SecretHash: AWSAuth.hashSecret(email),
      UserAttributes: userAttr,
    };
    try {
      const response = await cognitoIdentity.signUp(params).promise();
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  /**
   * confirm to aws cognito
   */
  async confirm(email: string, code: string): Promise<any> {
    const params = {
      ClientId: AWSAuth.ClientId,
      Username: email,
      ConfirmationCode: code,
      SecretHash: AWSAuth.hashSecret(email),
    };
    try {
      const res = await cognitoIdentity.confirmSignUp(params).promise();
      return res;
    } catch (error: any) {
      return error;
    }
  }
  /**
   * login from aws cognito
   */
  async login(email: string, password: string): Promise<any> {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: AWSAuth.ClientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: AWSAuth.hashSecret(email),
      },
    };
    try {
      const response = await cognitoIdentity.initiateAuth(params).promise();
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  /**
   *  resend code to aws cognito
   */
  async resendCode(email: string): Promise<any> {
    const params = {
      ClientId: AWSAuth.ClientId,
      Username: email,
      SecretHash: AWSAuth.hashSecret(email),
    };
    try {
      const res = await cognitoIdentity
        .resendConfirmationCode(params)
        .promise();
      return res;
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }
}
