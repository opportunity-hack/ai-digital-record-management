import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import type { SyntheticEvent } from "react";
import { useState } from "react";

import AccountButton from "@/components/account/button";
import AccountForm from "@/components/account/form";
import AccountInput from "@/components/account/input";
import ROUTES from "@/constants/routes";
import { confirmSignUp, resendSignUp } from "@/services/auth";

export default function ConfirmUser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    const email = searchParams.get("username") || "";
    const response = await confirmSignUp(email, confirmationCode);

    if (response === "Success") router.push(ROUTES.login);
    setStatus(response);
  };

  const resendCode = async () => {
    const email = searchParams.get("username") || "";
    const response = await resendSignUp(email);

    if (response === "Success") setIsCodeSent(true);
  };

  return (
    <main className="flex h-screen flex-row items-center justify-center align-middle">
      <AccountForm onSubmit={onSubmit}>
        <AccountInput placeholder="Confirmation Code" type="password" value={confirmationCode} onChange={(event) => setConfirmationCode(event.target.value)} />

        <span className="mt-4 text-center font-semibold text-pc">{status}</span>

        <AccountButton text="Confirm User" />
        <span className="mt-2 flex w-full  justify-center text-left text-sm font-semibold ">
          {isCodeSent ? (
            <span>Code sent!</span>
          ) : (
            <span>
              <button className="text-pc underline" onClick={resendCode} type="button">
                Resend Code
              </button>
            </span>
          )}
        </span>
      </AccountForm>
    </main>
  );
}
