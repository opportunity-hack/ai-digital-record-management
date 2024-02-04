import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { SyntheticEvent } from "react";
import { useState } from "react";

import AccountButton from "@/components/account/button";
import AccountForm from "@/components/account/form";
import AccountInput from "@/components/account/input";
import AccountPasswordInput from "@/components/account/password-input";
import CONFIG from "@/constants/config";
import ROUTES from "@/constants/routes";
import { signUp } from "@/services/auth";

export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassowrd, setConfirmPassowrd] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [signupDisabled, setSignupDisabled] = useState<boolean>(false);

  const router = useRouter();

  const onSignUp = async (event: SyntheticEvent) => {
    event.preventDefault();
    setSignupDisabled(true);
    const response = await signUp(email, password, confirmPassowrd);

    if (response === "User successfully created") router.push(`${ROUTES.confirm}?username=${email}`);

    setStatus(response);
    setSignupDisabled(false);
  };

  return (
    <main className="flex h-screen flex-row items-center justify-center align-middle">
      <Head>
        <title>Sign Up | {CONFIG.siteName}</title>
      </Head>
      <AccountForm onSubmit={onSignUp}>
        {/* <button className="flex w-full max-w-lg flex-row justify-center rounded border-2 border-b-4 bg-white p-2 font-semibold outline-1 hover:brightness-95" type="button" onClick={() => signInWithGoogle()}>
          <Image className="mr-5" src={google} alt="" width={25} />
          Join using Google
        </button>
        <span className="my-4 font-bold">or</span> */}

        <span className="w-full space-y-1">
          <AccountInput placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <AccountPasswordInput placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <AccountPasswordInput placeholder="Confirm Password" value={confirmPassowrd} onChange={(event) => setConfirmPassowrd(event.target.value)} />
        </span>

        <span className="mt-4 text-center font-semibold text-pc">{status}</span>
        <AccountButton text="Sign Up" disabled={signupDisabled} />

        <span className="mt-2 flex w-full  justify-center text-left text-sm font-semibold ">
          <span>
            Existing User?{" "}
            <Link className="text-pc underline" href={ROUTES.login}>
              Log in
            </Link>
          </span>
        </span>
      </AccountForm>
    </main>
  );
}
