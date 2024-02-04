import { LockRounded } from "@mui/icons-material";
import { Auth } from "aws-amplify";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import ROUTES from "@/constants/routes";

export default function withAuthenticator(page: any, redirect: string) {
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
    return page;
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <LockRounded className="text-6xl" />
      <h1 className="font-sans text-4xl font-bold">Locked</h1>
      <h1 className="">Log in to use this page's functionalities.</h1>
      <Link className="mt-2 rounded bg-pc px-8 py-2 font-semibold text-white" href={`${ROUTES.login}?redirect=${redirect}`}>
        Login
      </Link>
    </div>
  );
}
