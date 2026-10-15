"use client";

import { useActionState } from "react";
import { signIn, type FormState } from "../actions";

const field = "w-full border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900";

export default function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, {});
  return (
    <form action={action} className="flex flex-col gap-3">
      <input name="email" type="email" placeholder="Email" autoComplete="username" defaultValue={state.email} required className={field} />
      <input name="password" type="password" placeholder="Password" autoComplete="current-password" required className={field} />
      {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className="bg-neutral-900 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
