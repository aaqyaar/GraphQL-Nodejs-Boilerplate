import confirmEmailTemplate from './confirmCodeEmail';
import { sendEmail } from './nodemailer';

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
};
