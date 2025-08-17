"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/_core/utils/cn";

type LinkItem = { type: "link"; label: string; href: string };
type ActionItem = { type: "action"; label: string; onClick: () => void };
type MenuItem = LinkItem | ActionItem;

export function SlideDown({
  title,
  items,
  className,
  defaultOpen = false,
}: {
  title: string;
  items: MenuItem[];
  className?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={rootRef} className={cn("w-[305px] relative", className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "h-[50px] w-full px-4 flex items-center justify-center gap-2",
          "rounded-[5px] transition-colors duration-200 ease-in-out",
          "focus-visible:outline-none",

          open
            ? "bg-[var(--color-mainMint)] text-black border-0 shadow-[0_6px_16px_rgba(0,0,0,0.12)]"
            : "bg-white text-black border border-gray-200 hover:bg-[var(--color-mainMint)] shadow"
        )}
      >
        <span className="text-l">{title}</span>
      </button>

      <AnimatePresence initial={false} mode="wait">
        {open && (
          <motion.div
            key="panel"
            className="absolute left-0 right-0 top-[calc(100%)] z-50"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div
              id={panelId}
              className="bg-white shadow rounded-[5px] overflow-hidden divide-y"
            >
              {items.map((it, idx) => {
                if (it.type === "link") {
                  return (
                    <Link
                      key={idx}
                      href={it.href}
                      onClick={() => setOpen(false)}
                      className="flex w-full h-[40px] px-4 items-center justify-center"
                    >
                      {it.label}
                    </Link>
                  );
                }
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      it.onClick();
                      setOpen(false);
                    }}
                    className="w-full h-[50px] px-4 text-center"
                  >
                    {it.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
