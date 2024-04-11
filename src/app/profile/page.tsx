import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


const Profile = async () => {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      Profile
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
      {session.user?.email}
        </div>.
    </div>
  );
};

export default Profile;