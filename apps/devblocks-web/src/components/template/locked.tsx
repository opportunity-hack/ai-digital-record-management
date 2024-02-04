import routes from "@/constants/routes";
import { LockRounded } from "@mui/icons-material"
import { Auth } from "aws-amplify";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function withAuthenticator(page: any) {
  const router = useRouter()
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      setIsSignedIn(true);
    } catch (error) {
      setIsSignedIn(false);
    }
  };

  if (isSignedIn) {
    return page
  }
  else {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen">
        <LockRounded className="text-6xl" />
        <h1 className="font-bold font-sans text-4xl">Locked</h1>
        <h1 className="">Log in to use this page's functionalities.</h1>
        <Link className="bg-pc text-white px-8 py-2 rounded font-semibold mt-2" href={`${routes.login}?redirect=${router.route}`}>Login</Link>
      </div>
    );
  }
}