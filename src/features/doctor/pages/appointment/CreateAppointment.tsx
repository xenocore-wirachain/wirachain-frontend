import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { Card } from "primereact/card"
import { InputTextarea } from "primereact/inputtextarea"
import { classNames } from "primereact/utils"
import { Controller } from "react-hook-form"
import DropdownPatientPerClinic from "../../../../components/DropdownPatientPerClinic"
import MultiSelectTestPerClinic from "../../../../components/MultiSelectTestPerClinic"
import { useConsultationHook } from "../../hooks/ConsultationHook"

function CreateAppointment() {
  const { control, errors, isCreating, handleFormSubmitCreate } =
    useConsultationHook()

  return (
    <Card className="shadow-md">
      <form
        id="createAppointment"
        onSubmit={handleFormSubmitCreate}
        className="p-fluid"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PACIENTE */}
          <div className="field" key="idPatient">
            <span className="p-float-label">
              <Controller
                name="idPatient"
                control={control}
                rules={{ required: "Se requiere paciente" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <DropdownPatientPerClinic
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    invalid={errors.idPatient ? true : false}
                    disabled={isCreating}
                  />
                )}
              />
              <label
                htmlFor="idPatient"
                className={classNames({ "p-error": errors.idPatient })}
              >
                Nombre*
              </label>
            </span>
            {errors.idPatient && (
              <small className="p-error">
                {errors.idPatient.message?.toString()}
              </small>
            )}
          </div>

          {/* NEXT APPOINTMENT */}
          <div className="field" key="nextAppointmentDate">
            <span className="p-float-label">
              <Controller
                name="nextAppointmentDate"
                control={control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Calendar
                    readOnlyInput
                    onBlur={onBlur}
                    onChange={onChange}
                    value={
                      value instanceof Date || value === null ? value : null
                    }
                    ref={ref}
                    invalid={errors.nextAppointmentDate ? true : false}
                    minDate={new Date()}
                    disabled={isCreating}
                  />
                )}
              />
              <label
                htmlFor="nextAppointmentDate"
                className={classNames({
                  "p-error": errors.nextAppointmentDate,
                })}
              >
                Fecha de la proxima visita
              </label>
            </span>
            {errors.nextAppointmentDate && (
              <small className="p-error">
                {errors.nextAppointmentDate.message?.toString()}
              </small>
            )}
          </div>

          {/* CHECKIN */}
          <div className="field" key="checkInTime">
            <span className="p-float-label">
              <Controller
                name="checkInTime"
                control={control}
                rules={{ required: "Se requiere hora de entrada" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Calendar
                    onBlur={onBlur}
                    onChange={onChange}
                    value={
                      value instanceof Date || value === null ? value : null
                    }
                    ref={ref}
                    invalid={errors.checkInTime ? true : false}
                    disabled={isCreating}
                    timeOnly
                  />
                )}
              />
              <label
                htmlFor="checkInTime"
                className={classNames({ "p-error": errors.checkInTime })}
              >
                Hora de entrada*
              </label>
            </span>
            {errors.checkInTime && (
              <small className="p-error">
                {errors.checkInTime.message?.toString()}
              </small>
            )}
          </div>

          {/* CHECKOUT */}
          <div className="field" key="checkOutTime">
            <span className="p-float-label">
              <Controller
                name="checkOutTime"
                control={control}
                rules={{ required: "Se requiere hora de salida" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Calendar
                    onBlur={onBlur}
                    onChange={onChange}
                    value={
                      value instanceof Date || value === null ? value : null
                    }
                    ref={ref}
                    invalid={errors.checkOutTime ? true : false}
                    disabled={isCreating}
                    timeOnly
                  />
                )}
              />
              <label
                htmlFor="checkOutTime"
                className={classNames({ "p-error": errors.checkOutTime })}
              >
                Hora de salida*
              </label>
            </span>
            {errors.checkOutTime && (
              <small className="p-error">
                {errors.checkOutTime.message?.toString()}
              </small>
            )}
          </div>

          {/* MEDICAL TESTS */}
          <div className="field md:col-span-2" key="medicalTestIds">
            <span className="p-float-label">
              <Controller
                name="medicalTestIds"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MultiSelectTestPerClinic
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    invalid={errors.medicalTestIds ? true : false}
                    disabled={isCreating}
                    display="chip"
                    maxSelectedLabels={3}
                    showSelectAll={false}
                  />
                )}
              />
              <label
                htmlFor="medicalTestIds"
                className={classNames({ "p-error": errors.medicalTestIds })}
              >
                Estudios medicos
              </label>
            </span>
            {errors.medicalTestIds && (
              <small className="p-error">
                {errors.medicalTestIds.message?.toString()}
              </small>
            )}
          </div>

          {/* RAZON DE VISITA */}
          <div className="field md:col-span-2" key="visitReason">
            <span className="p-float-label">
              <Controller
                name="visitReason"
                control={control}
                rules={{ required: "Se requiere razon de visita" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputTextarea
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    invalid={errors.visitReason ? true : false}
                    disabled={isCreating}
                    rows={3}
                    cols={30}
                  />
                )}
              />
              <label
                htmlFor="visitReason"
                className={classNames({ "p-error": errors.visitReason })}
              >
                Razón de visita*
              </label>
            </span>
            {errors.visitReason && (
              <small className="p-error">
                {errors.visitReason.message?.toString()}
              </small>
            )}
          </div>

          {/* NOTAS */}
          <div className="field md:col-span-2" key="notes">
            <span className="p-float-label">
              <Controller
                name="notes"
                control={control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputTextarea
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    invalid={errors.notes ? true : false}
                    disabled={isCreating}
                    rows={3}
                    cols={30}
                  />
                )}
              />
              <label
                htmlFor="notes"
                className={classNames({ "p-error": errors.notes })}
              >
                Notas (Opcional)
              </label>
            </span>
            {errors.notes && (
              <small className="p-error">
                {errors.notes.message?.toString()}
              </small>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            type="submit"
            form="createAppointment"
            label={isCreating ? "Creando..." : "Crear consulta"}
            className="w-full md:w-1/3"
            icon={isCreating ? "pi pi-spin pi-spinner" : "pi pi-save"}
            loading={isCreating}
            disabled={isCreating}
            severity="info"
            size="large"
          />
        </div>
      </form>
    </Card>
  )
}

export default CreateAppointment
