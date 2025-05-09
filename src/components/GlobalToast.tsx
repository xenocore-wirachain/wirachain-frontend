import { Toast } from "primereact/toast"
import { useEffect, useRef } from "react"
import { clearToasts, useAppDispatch, useAppSelector } from "../redux"

const GlobalToast = () => {
  const toastRef = useRef<Toast>(null)
  const { messages } = useAppSelector(state => state.toast)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (messages.length > 0 && toastRef.current) {
      toastRef.current.show(messages)
      dispatch(clearToasts())
    }
  }, [messages, dispatch])

  return <Toast ref={toastRef} />
}

export default GlobalToast
