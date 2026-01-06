"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useModalStore } from "@/stores/useModalStore";

export function ModalRenderer() {
  const { currentModal, hideModal } = useModalStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isHandlingPopState = useRef(false);

  const prevPathname = useRef(pathname);
  const prevSearchParams = useRef(searchParams.toString());

  // popstate 이벤트 감지
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isHandlingPopState.current) return;
      isHandlingPopState.current = true;

      const isModalState = event.state?.isModal;
      if (currentModal && !isModalState) {
        hideModal(true);
      }

      setTimeout(() => {
        isHandlingPopState.current = false;
      }, 0);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentModal, hideModal]);

  // 라우트 변경 시 모달 닫기
  useEffect(() => {
    const currentSearch = searchParams.toString();

    if (
      prevPathname.current !== pathname ||
      prevSearchParams.current !== currentSearch
    ) {
      if (!isHandlingPopState.current && currentModal) {
        hideModal(false);
      }
    }

    prevPathname.current = pathname;
    prevSearchParams.current = currentSearch;
  }, [pathname, searchParams, currentModal, hideModal]);

  const handleDimmedClick = () => {
    if (currentModal?.closeOnDimmedClick !== false) {
      hideModal(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {currentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            className="pointer-events-auto absolute inset-0 bg-black"
            onClick={handleDimmedClick}
            aria-label="dimmed"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="z-10"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ ease: "easeOut", duration: 0.2 }}
          >
            <currentModal.component
              {...currentModal.props}
              isOpen={true}
              onClose={() => hideModal(false)}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
