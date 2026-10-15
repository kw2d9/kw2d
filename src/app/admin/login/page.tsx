import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin";
import LoginForm from "./LoginForm";

async function Gate() {
  if (await getAdmin()) redirect("/admin");
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm border border-neutral-200 bg-white p-8">
        <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-neutral-500">KW2D</p>
        <h1 className="mb-6 text-xl font-bold">Admin sign in</h1>
        <Suspense fallback={<div className="h-40" />}>
          <Gate />
        </Suspense>
      </div>
    </main>
  );
}
