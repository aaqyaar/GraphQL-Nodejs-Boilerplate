import AWSAuth from './AWSAuth';
import JWTAuth from './JWTAuth';

const auth = new AWSAuth();

export default class AuthService {
  /**
   * register to aws cognito
   * @param email
   * @param password
   * @returns
   * @throws Error
   */
  public static async register(email: string, password: string): Promise<any> {
    const userAttr = [
      {
        Name: 'email',
        Value: email,
      },
    ];
    try {
      const res = await auth.register(email, password, userAttr);
      if (res instanceof Error) {
        throw new Error(res.message);
      }
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  /**
   * login from aws cognito
   * @param email
   * @param password
   * @returns
   * @throws Error
   */
  public static async login(email: string, password: string) {
    try {
      const res = await auth.login(email, password);
      if (res instanceof Error) {
        throw new Error(res.message);
      }
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * confirm to aws cognito
   * @param email
   * @param code
   * @returns
   * @throws Error
   *
   **/

  public static async confirm(email: string, code: string) {
    try {
      const res = await auth.confirm(email, code);
      if (res instanceof Error) {
        throw new Error(res.message);
      }
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
