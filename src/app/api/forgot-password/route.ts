import User from "@/models/User";
import connect from "@/utils/db";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import { NextResponse } from "next/server";
import { error } from "console";

export const POST = async (request: any) => {
  const { email } = await request.json();

  await connect();

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return new NextResponse("Email address is not signed up.", { status: 400 });
  } 

  const resetToken = crypto.randomBytes(20).toString("hex");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const passwordResetExpires = Date.now() + 3600000;

  existingUser.resetToken = passwordResetToken;
  existingUser.resetTokenExpiry = passwordResetExpires;
  const resetUrl = `localhost:74/reset-password/${resetToken}`;

  console.log(resetUrl);

  const body = "Reset your password by clicking on the following link: " + resetUrl;

  const msg = {
    to: email,
    from: "webadmin@etec-support.com",
    subject: "Reset your Password",
    text: body,
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

  sgMail.send(msg).then(() => {
    return new NextResponse("Reset password email was sent.", {status: 200});
  }).catch(async(error) => {
    existingUser.resetToken = undefined;
    existingUser.resetTokenExpiry = undefined;
    await existingUser.save();

    return new NextResponse("Failed to send email. Try again.", {
      status: 400,
    });
  });

  try {
    await existingUser.save();
    return new NextResponse("Email was sent to reset password", {
      status: 200,
    });
    
  } catch (error: any) {
    return new NextResponse(error, {
      status: 500,
    });
  }

};