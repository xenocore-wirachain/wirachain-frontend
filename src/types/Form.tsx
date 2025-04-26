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

type FieldType =
  | "phone"
  | "mail"
  | "date"
  | "pass"
  | "simple-text"
  | "dropdown"
  | "text-number"
  | "gender"

export type DropDownField = {
  id: string
  value: string
}

export type MultiFuntionalForm<T> = {
  name: keyof T
  label: string
  placeholder?: string
  type: FieldType
  rules: Record<string, unknown>
  minDate?: Date
  maxDate?: Date
  options?: DropDownField[]
}
