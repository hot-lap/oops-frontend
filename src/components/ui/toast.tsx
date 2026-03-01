"use client";

import hotToast, { type Toast, Toaster as HotToaster } from "react-hot-toast";
import { motion } from "framer-motion";
import CheckCircleIcon from "@/assets/icons/check-circle.svg";
import AlertCircleIcon from "@/assets/icons/alert-circle.svg";

function ToastContent({
  t,
  type,
  message,
}: {
  t: Toast;
  type: "success" | "error";
  message: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={t.visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex items-center gap-2 bg-gray-500 pl-[14px] pr-4 py-3 rounded-full shadow-[0px_4px_12px_rgba(28,25,23,0.06),0px_6px_50px_rgba(28,25,23,0.12)]"
    >
      <div className="shrink-0 size-5">
        {type === "success" ? <CheckCircleIcon /> : <AlertCircleIcon />}
      </div>
      <p className="text-[15px] text-white leading-[1.6] max-w-[268px] md:max-w-[626px]">
        {message}
      </p>
    </motion.div>
  );
}

export const toast = {
  success: (message: string) =>
    hotToast.custom(
      (t) => <ToastContent t={t} type="success" message={message} />,
      { duration: 3000 },
    ),
  error: (message: string) =>
    hotToast.custom(
      (t) => <ToastContent t={t} type="error" message={message} />,
      { duration: 3000 },
    ),
};

export function Toaster() {
  return <HotToaster position="top-center" />;
}
