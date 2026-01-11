import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import BillEmail from "@/components/emails/BillEmail";

interface BillDetails {
  billId: string;
  amount: number;
  dueDate: string;
  customerName: string;
  billingPeriodStart?: string;
  billingPeriodEnd?: string;
  consumption?: number;
  tariffRate?: number;
  baseAmount?: number;
  taxAmount?: number;
  utilityType?: string;
}

const port = parseInt(process.env.SMTP_PORT || "587");
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: port,
  secure: port === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendBillEmail(email: string, billDetails: BillDetails) {
  try {
    // If SMTP is not configured, fall back to console logging
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(
        `[Email Service - Not Configured] Would send bill to ${email}`,
        billDetails
      );
      console.warn(
        "⚠️ Email service not configured. Please set SMTP_USER and SMTP_PASS (and optionally SMTP_HOST, SMTP_PORT) in .env.local"
      );
      return { success: true, message: "Email service not configured" };
    }

    // Render the email template
    const emailHtml = await render(
      BillEmail({
        customerName: billDetails.customerName,
        billId: billDetails.billId,
        amount: billDetails.amount,
        dueDate: billDetails.dueDate,
        billingPeriodStart: billDetails.billingPeriodStart,
        billingPeriodEnd: billDetails.billingPeriodEnd,
        consumption: billDetails.consumption,
        tariffRate: billDetails.tariffRate,
        baseAmount: billDetails.baseAmount,
        taxAmount: billDetails.taxAmount,
        utilityType: billDetails.utilityType,
      })
    );

    // Send the email using Nodemailer
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: `Your Utility Bill - ${billDetails.billId}`,
      html: emailHtml,
    });

    console.log(`✅ Bill email sent successfully to ${email}`, info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
