import { Auth } from "aws-amplify";
import Head from "next/head";
import type { SyntheticEvent } from "react";
import { useState } from "react";

import AccountButton from "@/components/account/button";
import AccountForm from "@/components/account/form";
import AccountInput from "@/components/account/input";
import CONFIG from "@/constants/config";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setDisabled(true);

    try {
      await Auth.forgotPassword(email);
      setStatus("Password reset email sent.");
    } catch (error: any) {
      setStatus(error.message);
    }

    setDisabled(false);
  };

  return (
    <main className="flex h-screen flex-row items-center justify-center align-middle">
      <Head>
        <title>Forgot Password | {CONFIG.siteName}</title>
      </Head>
      <AccountForm onSubmit={onSubmit}>
        <span className="text-center">Please enter the email address you would like your reset password information sent to.</span>
        <AccountInput placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />

        <AccountButton className="mt-4 w-full max-w-lg rounded-md bg-pc px-2 py-3 font-bold text-bg outline-1 outline-black" text="Reset Password" disabled={disabled} />
        <span className="mt-2 text-center font-semibold text-pc">{status}</span>
      </AccountForm>
    </main>
  );
}
