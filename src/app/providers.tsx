"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, Suspense, useState } from "react";
import { queryClient } from "../lib/queryClient";
import { ClientOnly } from "@/components/common/ClientOnly";
import { ModalRenderer } from "@/components/common/Modal";

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
      <ClientOnly>
        <Suspense fallback={null}>
          <ModalRenderer />
        </Suspense>
      </ClientOnly>
    </QueryClientProvider>
  );
}
