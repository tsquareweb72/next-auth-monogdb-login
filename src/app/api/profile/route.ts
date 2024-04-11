import User from "@/models/User";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
  const { firstName, lastName, account, email } = await request.json();

  await connect();

  const existingUser = await User.findOne({ email });
  const existingAccount = await User.findOne({ account });

  if (existingUser) {
    return new NextResponse("Email is already in use", { status: 400 });
  } 
  else if( existingAccount){
    return new NextResponse("Account is already registered", { status: 401});
  }

 
  const currentUser = new User({
    firstName,
    lastName,
    account,
    email,
  });

  try {
    await currentUser.save();
    return new NextResponse("user is registered", { status: 200 });
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};