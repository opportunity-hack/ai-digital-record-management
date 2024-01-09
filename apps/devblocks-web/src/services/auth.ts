import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { Auth } from "aws-amplify";

export async function signInWithEmail(email: string, password: string) {
  try {
    await Auth.signIn(email, password);
    return "Successfully signed in";
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
  }

  return "";
}

export function signInWithGoogle() {
  Auth.federatedSignIn({
    provider: CognitoHostedUIIdentityProvider.Google,
  });
}

export async function resendSignUp(email: string) {
  try {
    await Auth.resendSignUp(email);
    return "Success";
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return "";
  }
}

export async function signUp(email: string, password: string, confirmPassword: string) {
  if (password === "") return "Password field is empty";
  if (password !== confirmPassword) return "Passwords don't match";

  try {
    await Auth.signUp({
      username: email,
      password,
      autoSignIn: {
        enabled: true,
      },
    });
    return "User successfully created";
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "UsernameExistsException") return "An account with the given email already exists. Login instead";
      return error.message;
    }
    return "";
  }
}

export async function confirmSignUp(username: string, code: string) {
  try {
    await Auth.confirmSignUp(username, code);
    return "Success";
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return "";
  }
}

export async function signOut() {
  try {
    await Auth.signOut();
    return "";
  } catch (error) {
    return "";
  }
}
