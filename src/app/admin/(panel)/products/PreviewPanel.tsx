"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/product-types";
import { PREVIEW_READY, type PreviewMessage, type PreviewView } from "../../preview/PreviewClient";

type Device = "desktop" | "mobile";

const tab = (on: boolean) => `px-3 py-1.5 text-xs font-semibold ${on ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-900"}`;

/** Full-screen preview of the unsaved product, rendered with the real storefront components. */
export default function PreviewPanel({
  product,
  sortOrder,
  active,
  onClose,
}: {
  product: Product;
  sortOrder: number;
  active: boolean;
  onClose: () => void;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [view, setView] = useState<PreviewView>("product");
  const [device, setDevice] = useState<Device>("desktop");
  const [ready, setReady] = useState(false);

  // Send the latest form state whenever it changes or the frame (re)loads.
  useEffect(() => {
    if (!ready) return;
    const msg: PreviewMessage = { type: "kw2d-preview", product, view, sortOrder };
    frame.current?.contentWindow?.postMessage(msg, window.location.origin);
  }, [ready, product, view, sortOrder]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.source === frame.current?.contentWindow && e.data?.type === PREVIEW_READY) setReady(true);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("message", onMessage);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Product preview" className="fixed inset-0 z-50 flex flex-col bg-neutral-200">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-300 bg-white px-4 py-2.5">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold">Preview</span>
          <div className="flex border border-neutral-300" role="group" aria-label="Page">
            <button type="button" className={tab(view === "product")} aria-pressed={view === "product"} onClick={() => setView("product")}>Product page</button>
            <button type="button" className={tab(view === "catalog")} aria-pressed={view === "catalog"} onClick={() => setView("catalog")}>Catalog</button>
          </div>
          <div className="flex border border-neutral-300" role="group" aria-label="Device">
            <button type="button" className={tab(device === "desktop")} aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>Desktop</button>
            <button type="button" className={tab(device === "mobile")} aria-pressed={device === "mobile"} onClick={() => setDevice("mobile")}>Mobile</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-xs text-neutral-500 md:inline">
            {active ? "Not saved yet. This is how it will look once saved." : "Hidden: this product will not appear on the site until “Visible on the site” is ticked."}
          </span>
          <button type="button" onClick={onClose} className="bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white">Close</button>
        </div>
      </div>
      <div className="flex flex-1 justify-center overflow-hidden p-0 data-[device=mobile]:py-6" data-device={device}>
        <iframe
          ref={frame}
          src="/admin/preview"
          title="Storefront preview"
          className={`border-0 bg-background ${device === "mobile" ? "h-full max-h-[844px] w-[390px] shadow-xl" : "h-full w-full"}`}
        />
      </div>
    </div>
  );
}
