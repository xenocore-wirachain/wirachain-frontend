import { Calendar } from "primereact/calendar"
import { Dropdown } from "primereact/dropdown"
import { InputMask } from "primereact/inputmask"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { classNames } from "primereact/utils"
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form"
import type { MultiFuntionalForm } from "../types/Form"

function RenderEachInput<TValue extends FieldValues>(
  field: MultiFuntionalForm<TValue>,
  formField: ControllerRenderProps<TValue, Path<TValue>>,
  fieldState: ControllerFieldState,
  isSubmitting: boolean,
) {
  const commonProps = {
    id: formField.name,
    className: classNames({ "p-invalid": fieldState.invalid }),
    disabled: isSubmitting,
    placeholder: field.placeholder,
  }

  switch (field.type) {
    case "simple-text":
      return (
        <InputText
          {...commonProps}
          value={formField.value}
          keyfilter="alpha"
          onChange={e => {
            formField.onChange(e.target.value)
          }}
          onBlur={formField.onBlur}
          name={formField.name}
          ref={formField.ref}
        />
      )

    case "date":
      return (
        <Calendar
          showButtonBar
          locale="es"
          dateFormat="mm-dd-yy"
          {...commonProps}
          value={formField.value}
          onChange={e => {
            formField.onChange(e.target.value)
          }}
          onBlur={formField.onBlur}
          name={formField.name}
          ref={formField.ref}
          maxDate={field.maxDate}
          minDate={field.minDate}
        />
      )

    case "mail":
      return (
        <InputText
          {...commonProps}
          value={formField.value}
          keyfilter="email"
          onChange={e => {
            formField.onChange(e.target.value)
          }}
          onBlur={formField.onBlur}
          name={formField.name}
          ref={formField.ref}
        />
      )

    case "phone":
      return (
        <InputMask
          {...commonProps}
          value={formField.value}
          mask="999-999-999"
          onChange={e => {
            formField.onChange(e.target.value)
          }}
          onBlur={formField.onBlur}
          name={formField.name}
          ref={formField.ref}
        />
      )

    case "text-number":
      return (
        <InputText
          {...commonProps}
          value={formField.value}
          keyfilter="int"
          onChange={e => {
            formField.onChange(e.target.value)
          }}
          onBlur={formField.onBlur}
          name={formField.name}
          ref={formField.ref}
        />
      )

    case "pass":
      return (
        <Password
          toggleMask
          {...commonProps}
          value={formField.value}
          onChange={e => {
            formField.onChange(e.target.value)
          }}
          onBlur={formField.onBlur}
          name={formField.name}
          ref={formField.ref}
        />
      )

    case "dropdown":
      return (
        <Dropdown
          {...commonProps}
          value={formField.value}
          onChange={e => {
            formField.onChange(e.value)
          }}
          onBlur={formField.onBlur}
          name={formField.name}
          ref={formField.ref}
          options={field.options}
          optionLabel="value"
        />
      )
  }
}

export default RenderEachInput
