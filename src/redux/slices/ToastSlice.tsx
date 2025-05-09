import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { ToastMessage } from "primereact/toast"

type ToastState = {
  messages: ToastMessage[]
  counter: number
}

const initialState: ToastState = {
  messages: [],
  counter: 0,
}

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<ToastMessage>) => {
      state.messages = [{ ...action.payload, id: state.counter.toString() }]
      state.counter += 1
    },
    showMultipleToasts: (state, action: PayloadAction<ToastMessage[]>) => {
      state.messages = action.payload.map((message, index) => ({
        ...message,
        id: (state.counter + index).toString(),
      }))
      state.counter += action.payload.length
    },
    clearToasts: state => {
      state.messages = []
    },
  },
})

export const { showToast, showMultipleToasts, clearToasts } = toastSlice.actions

export const showSuccessToast = (
  summary: string,
  detail: string,
  life = 3000,
) => showToast({ severity: "success", summary, detail, life })

export const showErrorToast = (summary: string, detail: string, life = 5000) =>
  showToast({ severity: "error", summary, detail, life })

export const showInfoToast = (summary: string, detail: string, life = 3000) =>
  showToast({ severity: "info", summary, detail, life })

export const showWarnToast = (summary: string, detail: string, life = 3000) =>
  showToast({ severity: "warn", summary, detail, life })

export const ToastReducer = toastSlice.reducer
