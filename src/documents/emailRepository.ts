import confirmEmailTemplate from './confirmCodeEmail';
import { sendEmail } from './nodemailer';

export default {
  sendConfirmEmail: async (code: number) => {
    try {
      const result = await sendEmail({
        subject: `Confirm your email`,
        text: confirmEmailTemplate(code),
      });
      return { ...result };
    } catch (error: any) {
      throw new Error(error);
    }
  },
};
