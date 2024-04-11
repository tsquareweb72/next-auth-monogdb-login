import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const Dashboard = async () => {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      Dashboard
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/profile">
            Profile
          </Link>
        </div>.
    </div>
  );
};

export default Dashboard;