export default function resetPasswordEmail(uri: string) {
  return `
    <div style="text-align: left; padding: 20px; background-color: #f5f5f5; border-radius: 5px; font-family: sans-serif; max-width: 500px; margin: 0 auto;">
    <h2>Reset your password</h2>
    <p>Please click the button below to reset your password</p>
    <p>Or copy and paste this link into your browser</p>
    <p>if you did not request this, please ignore this email and your password will remain unchanged</p>
    <p>${uri}</p>
    <a href="${uri}" style="padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <br />
    <br />
    <p>Thanks Regards,</p>
    <p>Nodejs Boilerplate</p>
    <p> <a href="https://abdizamedmo.netlify.app" style="text-decoration: none; color: #000;">Abdi Zamed Mo</a> </p>
    </div>
  `;
}
