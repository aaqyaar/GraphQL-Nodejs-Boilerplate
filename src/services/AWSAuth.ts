import AWS from 'aws-sdk';
import crypto from 'crypto';
import { awsExports } from '../config/aws-exports';

const { config, auth } = awsExports;

const cognitoIdentity = new AWS.CognitoIdentityServiceProvider({
  // apiVersion: config.apiVersion,
  region: config.region,
});

export default class AuthService {
  private static ClientId = auth.clientId as string;
  private static Secret = auth.clientSecret as string;

  private static hashSecret(email: string): string {
    return crypto
      .createHmac('SHA256', this.Secret)
      .update(email + this.ClientId)
      .digest('base64');
  }

  static async register(
    email: string,
    password: string,
    userAttr: Array<any>
  ): Promise<any> {
    const params = {
      ClientId: this.ClientId,
      Username: email,
      Password: password,
      SecretHash: this.hashSecret(email),
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

  static async confirm(email: string, code: string): Promise<any> {
    const params = {
      ClientId: this.ClientId,
      Username: email,
      ConfirmationCode: code,
      SecretHash: this.hashSecret(email),
    };
    try {
      const res = await cognitoIdentity.confirmSignUp(params).promise();
      return res;
    } catch (error: any) {
      return error;
    }
  }

  static async login(email: string, password: string): Promise<any> {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.ClientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.hashSecret(email),
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

  static async resendCode(email: string): Promise<any> {
    const params = {
      ClientId: this.ClientId,
      Username: email,
      SecretHash: this.hashSecret(email),
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
