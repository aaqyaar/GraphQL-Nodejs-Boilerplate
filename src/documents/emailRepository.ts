import confirmEmailTemplate from './confirmCodeEmail';
import { sendEmail } from './nodemailer';
import resetPasswordEmail from './resetPasswordEmail';

export default {
  sendConfirmEmail: async (userEmail: string, code: string) => {
    try {
      const result = await sendEmail({
        to: userEmail,
        subject: `Confirm your email`,
        text: confirmEmailTemplate(code),
      });
      return { ...result };
    } catch (error: any) {
      throw new Error(error);
    }
  },
  sendResetPasswordEmail: async (userEmail: string, uri: string) => {
    try {
      const result = await sendEmail({
        to: userEmail,
        subject: `Reset your password`,
        text: resetPasswordEmail(uri),
      });
      return { ...result };
    } catch (error: any) {
      throw new Error(error);
    }
  },
};
