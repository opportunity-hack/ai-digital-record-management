import { useState } from "react";

import AccountForm from "@/components/account/form";
import AccountInput from "@/components/account/input";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");

  return (
    <main className="flex h-screen flex-row items-center justify-center align-middle">
      <AccountForm>
        <AccountInput placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />

        <button className="mt-4 w-full max-w-lg rounded-md bg-pc px-2 py-3 font-bold text-bg outline-1 outline-black" type="submit">
          Reset Password
        </button>
      </AccountForm>
    </main>
  );
}
