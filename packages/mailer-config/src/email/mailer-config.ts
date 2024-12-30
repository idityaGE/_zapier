import nodemailer from "nodemailer";
import dotenv from "dotenv";

import { generateNormalEmailTemplate } from "../templates/normal-email-template";
import { generateOtpTemplate } from "../templates/otp-template";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendEmail(
  to: string,
  body: string,
  type: "otp" | "normal",
) {
  try {
    const data = await transporter.sendMail({
      from: `_zapier ⚡ <${process.env.MAIL_USER}>`,
      to: [to],
      subject: "_Zapier Official",
      html:
        type === "otp"
          ? generateOtpTemplate(body)
          : generateNormalEmailTemplate(body),
    });

    console.log("data from resend email = ", data);
  } catch (error) {
    // return console.error({ error });
    console.log("Error while sending email = ", error);
  }
}
