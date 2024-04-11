"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  // const session = useSession();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    try{
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      if (res.status === 400) {
        setError("This email is not registered");
      }
      if (res.status === 200) {
        setError("Password Reset sent");
        router.push("/login");
      }  
    } catch (error) {
      setError("Error, try again");
      console.log(error);
    }  

  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="p-8 rounded-lg shadow-md w-96">
          <h1 className="text-4xl text-center font-semibold mb-8">Forgot Password</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
              placeholder="Email"
              required
            />
           
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {" "}
              Submit
            </button>
            <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
          </form>
          <div className="form_alt_txt">- OR -</div>
          <div className="flow-root gap-4">
              <ul >
                <div className="flex items-center justify-between gap-10">
                  <Link
                    className="form_link_left"
                    href="/login"
                  >
                    <li>Login</li>
                  </Link>
                  <Link
                    className="form_link_right"
                    href="/register"
                  >
                    <li>Register</li>
                  </Link>
                </div>
              </ul>
          </div>
          
        </div>
      </div>
    )
  );
};

export default ForgotPassword;