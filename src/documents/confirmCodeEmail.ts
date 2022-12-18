export default function confirmEmailTemplate(code: number) {
  return `
        <div style="text-align: center; font-family: sans-serif; font-size: 16px; line-height: 1.5; color: #333; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 5px; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin-top: 50px; margin-bottom: 50px;">
        <h3>Please confirm your email</h3>
        <p>Your confirmation code is: ${code}</p>
        </div>
    `;
}
