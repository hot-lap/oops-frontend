"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, Suspense, useState } from "react";
import { queryClient } from "../lib/queryClient";
import { AuthProvider, ClientOnly, ModalRenderer } from "@/components";
import { Toaster } from "@/components/ui/toast";

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
      <Toaster />
    </QueryClientProvider>
  );
}
