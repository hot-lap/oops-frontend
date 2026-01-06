"use client";

import { ReactNode, useEffect, useEffectEvent, useState } from "react";

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  const updateMounted = useEffectEvent(() => {
    setMounted(true);
  });

  useEffect(() => {
    updateMounted();
  }, []);

  if (!mounted) return fallback;

  return <>{children}</>;
}
