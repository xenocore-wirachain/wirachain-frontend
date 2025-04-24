type InputType =
  | "text-allow-number"
  | "text-notallow-number"
  | "number"
  | "calendar"
  | "select"

type DropdownOption = {
  value: string | number
  label: string
}

export type ClinicForm<T> = {
  name: keyof T
  label: string
  rules: Record<string, unknown>
  inputType: InputType
  options?: DropdownOption[]
  min?: number
  max?: number
  format?: string
  placeholder?: string
}
