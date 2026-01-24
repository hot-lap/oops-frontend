"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, Suspense, useState } from "react";
import { Toaster } from "react-hot-toast";
import { queryClient } from "../lib/queryClient";
import { AuthProvider, ClientOnly, ModalRenderer } from "@/components";

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
      <ClientOnly>
        <Suspense fallback={null}>
          <ModalRenderer />
        </Suspense>
      </ClientOnly>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1c1917",
            color: "#fff",
            borderRadius: "12px",
            padding: "12px 16px",
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}
