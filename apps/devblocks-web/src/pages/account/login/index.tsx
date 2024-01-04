import Link from "next/link";
import { useRouter } from "next/router";
import type { SyntheticEvent } from "react";
import { useState } from "react";

import AccountButton from "@/components/account/button";
import AccountForm from "@/components/account/form";
import AccountInput from "@/components/account/input";
import AccountPasswordInput from "@/components/account/password-input";
import routes from "@/constants/routes";
import { signInWithEmail } from "@/services/auth";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [loginDisabled, setLoginDisabled] = useState<boolean>(false);

  const router = useRouter();

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setLoginDisabled(true);
    const response = await signInWithEmail(email, password);

    if (response === "User is not confirmed.") router.push(`${routes.confirm}?username=${email}`);
    if (response === "Successfully signed in") router.push(`${routes.dashboard}`);

    setStatus(response);

    setLoginDisabled(false);
  };

  return (
    <main className="flex h-screen flex-row items-center justify-center align-middle">
      <AccountForm onSubmit={onSubmit}>
        {/* <button className="flex w-full max-w-lg flex-row justify-center rounded border-2 border-b-4 bg-white p-2 font-semibold outline-1 hover:brightness-95" type="button" onClick={() => signInWithGoogle()}>
          <Image className="mr-5" src={google} alt="" width={25} />
          Sign In with Google
        </button>
        <span className="my-4 font-bold">or</span> */}

        <span className="w-full space-y-1">
          <AccountInput placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <AccountPasswordInput placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </span>

        <span className="mt-4 font-semibold text-pc">{status}</span>

        <AccountButton text="Log in" disabled={loginDisabled} />

        <span className="mt-2 flex w-full  justify-between text-left text-sm font-semibold ">
          <Link className="text-pc underline" href={routes.resetPassword}>
            Forgot Password?
          </Link>
          <span>
            New user?{" "}
            <Link className="text-pc underline" href={routes.signup}>
              Sign up
            </Link>
          </span>
        </span>
      </AccountForm>
    </main>
  );
}
