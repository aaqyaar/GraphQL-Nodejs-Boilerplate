import JWTAuth from './JWTAuth';

export default class AuthService {
  public static async login(email: string, password: string) {
    //   login logic
    const token = JWTAuth.sign({ email });
    return { token };
  }

  public static async register(email: string, password: string) {
    //   register logic
    const token = JWTAuth.sign({ email });
    return { token };
  }
}
