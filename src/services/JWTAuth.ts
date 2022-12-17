import jwt from 'jsonwebtoken';

export default class JWTAuth {
  private static secret = process.env.JWT_SECRET;
  //   sign and verify methods
  public static sign(payload: any) {
    return jwt.sign(payload, this.secret!);
  }
  public static verify(token: string) {
    return jwt.verify(token, this.secret!);
  }
}
