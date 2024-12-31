import nodemailer from "nodemailer";
import dotenv from "dotenv";

import { generateNormalEmailTemplate } from "../templates/normal-email-template";
import { generateOtpTemplate } from "../templates/otp-template";

dotenv.config();

const MAIL_SERVICE = process.env.MAIL_SERVICE as string;
const MAIL_HOST = process.env.MAIL_HOST as string;
const MAIL_USER = process.env.MAIL_USER as string;
const MAIL_PASS = process.env.MAIL_PASS as string;

const transporter = nodemailer.createTransport({
  service: MAIL_SERVICE,
  host: MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

export async function sendEmail(
  to: string,
  body: string,
  type: "otp" | "normal",
) {
  try {
    const html =
      type === "otp"
        ? generateOtpTemplate(body)
        : generateNormalEmailTemplate(body);

    const data = await transporter.sendMail({
      from: `_zapier ⚡ <${MAIL_USER}>`,
      to: [to],
      subject: "_Zapier Official",
      html,
    });

    console.log("data from resend email = ", data);
  } catch (error) {
    // return console.error({ error });
    console.log("Error while sending email = ", error);
  }
}
