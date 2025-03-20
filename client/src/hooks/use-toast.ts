import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import { useToast as useToastImpl } from "@/components/ui/use-toast";

type ToastOptions = Partial<Omit<Toast, "id" | "title" | "description">> & {
  title?: string;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

export const useToast = () => {
  const { toast, dismiss, toasts } = useToastImpl();

  return {
    toast: (props: ToastOptions) => {
      return toast(props);
    },
    dismiss,
    toasts,
  };
};
