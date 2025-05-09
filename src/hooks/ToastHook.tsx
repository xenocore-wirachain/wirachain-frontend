import type { ToastMessage } from "primereact/toast"
import {
  showErrorToast,
  showInfoToast,
  showMultipleToasts,
  showSuccessToast,
  showToast,
  showWarnToast,
  useAppDispatch,
} from "../redux"

export const useToast = () => {
  const dispatch = useAppDispatch()

  return {
    showSuccess: (summary: string, detail: string, life?: number) => {
      dispatch(showSuccessToast(summary, detail, life))
    },
    showError: (summary: string, detail: string, life?: number) => {
      dispatch(showErrorToast(summary, detail, life))
    },
    showInfo: (summary: string, detail: string, life?: number) => {
      dispatch(showInfoToast(summary, detail, life))
    },
    showWarn: (summary: string, detail: string, life?: number) => {
      dispatch(showWarnToast(summary, detail, life))
    },
    showCustom: (message: ToastMessage | ToastMessage[]) => {
      if (Array.isArray(message)) {
        dispatch(showMultipleToasts(message))
      } else {
        dispatch(showToast(message))
      }
    },
  }
}
