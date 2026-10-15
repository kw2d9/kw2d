"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteProduct } from "../actions";

export default function DeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} className="text-red-700 underline">
        Delete
      </button>
    );
  }
  return (
    <span className="flex items-center gap-2" role="group" aria-label={`Confirm deleting ${title}`}>
      <button
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await deleteProduct(id);
            if (res.ok) router.refresh();
            else setError(res.error);
          })
        }
        className="bg-red-700 px-2 py-1 text-xs font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Deleting…" : "Confirm delete"}
      </button>
      <button onClick={() => setConfirming(false)} className="text-xs underline">Cancel</button>
      {error && <span className="text-xs text-red-700">{error}</span>}
    </span>
  );
}
