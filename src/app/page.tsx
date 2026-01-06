"use client";

import { useModalStore } from "@/stores/useModalStore";

// 예제 모달 컴포넌트
function ExampleModal({
  onClose,
  text,
}: {
  onClose?: () => void;
  text: string;
}) {
  return (
    <div className="rounded-lg bg-white p-6">
      <h2 className="text-lg font-bold">모달 제목</h2>
      <p className="mt-2 text-gray-600">{text}</p>
      <button
        onClick={onClose}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
      >
        닫기
      </button>
    </div>
  );
}

export default function Home() {
  const { showModal } = useModalStore();

  const handleOpenModal = () => {
    showModal({
      component: ExampleModal,
      props: {
        text: "모달 내용입니다.",
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        onClick={handleOpenModal}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        모달 열기
      </button>
    </div>
  );
}
