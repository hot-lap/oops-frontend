import type { ComponentType } from "react";

// ModalRenderer에서 주입하는 props
export interface InjectedModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// 모달 컴포넌트가 받을 props 타입
export type ModalComponentProps<P = object> = P & InjectedModalProps;

// showModal에 전달할 설정 타입
export interface ModalConfig<P = object> {
  component: ComponentType<ModalComponentProps<P>>;
  props: Omit<P, keyof InjectedModalProps>;
  closeOnDimmedClick?: boolean;
}

// 내부 저장용 타입
export interface ModalInstance {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
  closeOnDimmedClick?: boolean;
}
