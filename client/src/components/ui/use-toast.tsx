// Adapted from: https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/default/ui/use-toast.tsx
import { useState, useEffect, createContext, useContext } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToastActionElement = React.ReactElement<{
  altText: string
  onClick: () => void
}>

type ToastProps = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  open: boolean
  onOpenChange: (open: boolean) => void
  variant: "default" | "destructive"
}

type Toast = Omit<ToastProps, "onOpenChange">

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: Omit<Toast, "id">
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<Omit<Toast, "id">> & Pick<Toast, "id">
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: Toast[]
}

const initialState: State = {
  toasts: [],
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [
          ...state.toasts,
          { id: genId(), open: true, ...action.toast },
        ].slice(-TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId ? { ...t, open: false } : t
          ),
        }
      }

      return {
        ...state,
        toasts: state.toasts.map((t) => ({ ...t, open: false })),
      }
    }

    case actionTypes.REMOVE_TOAST: {
      const { toastId } = action

      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== toastId),
        }
      }

      return {
        ...state,
        toasts: [],
      }
    }
  }
}

const ToastContext = createContext<{
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id" | "open" | "onOpenChange">) => void
  updateToast: (
    toast: Partial<Omit<Toast, "id">> & Pick<Toast, "id">
  ) => void
  dismissToast: (toastId?: string) => void
  removeToast: (toastId?: string) => void
}>({
  toasts: [],
  addToast: () => {},
  updateToast: () => {},
  dismissToast: () => {},
  removeToast: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useState<State>(initialState);

  const addToast = (toast: Omit<Toast, "id" | "open" | "onOpenChange">) => {
    dispatch({ type: actionTypes.ADD_TOAST, toast });
  };

  const updateToast = (
    toast: Partial<Omit<Toast, "id">> & Pick<Toast, "id">
  ) => {
    dispatch({ type: actionTypes.UPDATE_TOAST, toast });
  };

  const dismissToast = (toastId?: string) => {
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
  };

  const removeToast = (toastId?: string) => {
    dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
  };

  return (
    <ToastContext.Provider
      value={{
        toasts: state.toasts,
        addToast,
        updateToast,
        dismissToast,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const { toasts, addToast, updateToast, dismissToast, removeToast } =
    useContext(ToastContext)

  useEffect(() => {
    toasts.forEach((toast) => {
      if (!toast.open) {
        const timeoutId = setTimeout(() => {
          removeToast(toast.id)
        }, TOAST_REMOVE_DELAY)

        return () => clearTimeout(timeoutId)
      }
    })
  }, [toasts, removeToast])

  return {
    toasts,
    toast: addToast,
    update: updateToast,
    dismiss: dismissToast,
    remove: removeToast,
  }
}
