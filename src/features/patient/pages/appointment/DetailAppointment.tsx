import type { UUID } from "crypto"
import { Card } from "primereact/card"
import { Divider } from "primereact/divider"
import { useParams } from "react-router"
import { useDetailAppointmentHook } from "../../../../hooks/DetailAppointmentHook"

function DetailAppointment() {
  const { idAppointment } = useParams()
  const { AppoimentData } = useDetailAppointmentHook(idAppointment as UUID)

  return (
    <Card className="shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doctor Information */}
        <div className="col-span-1">
          <h2 className="text-xl font-bold text-blue-800 mb-3">
            <i className="pi pi-user-doctor mr-2"></i>
            Información del Doctor
          </h2>
          <Divider className="my-2" />
          <table className="w-full border-collapse">
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-200">
                <td className="py-3 font-semibold w-1/3">Nombre:</td>
                <td className="py-3">
                  {AppoimentData?.doctorInCharge.firstName}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 font-semibold">Apellido:</td>
                <td className="py-3">
                  {AppoimentData?.doctorInCharge.lastName}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 font-semibold">Género:</td>
                <td className="py-3">
                  {AppoimentData?.doctorInCharge.gender === "Male"
                    ? "Hombre"
                    : "Mujer"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Patient Information */}
        <div className="col-span-1">
          <h2 className="text-xl font-bold text-blue-800 mb-3">
            <i className="pi pi-user mr-2"></i>
            Información del Paciente
          </h2>
          <Divider className="my-2" />
          <table className="w-full border-collapse">
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-200">
                <td className="py-3 font-semibold w-1/3">Nombre:</td>
                <td className="py-3">{AppoimentData?.patient.firstName}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 font-semibold">Apellido:</td>
                <td className="py-3">{AppoimentData?.patient.lastName}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 font-semibold">Género:</td>
                <td className="py-3">
                  {AppoimentData?.patient.gender === "Male"
                    ? "Hombre"
                    : "Mujer"}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 font-semibold">Fecha de Nacimiento:</td>
                <td className="py-3">
                  {AppoimentData?.patient.dateOfBirth
                    ? new Date(
                        AppoimentData.patient.dateOfBirth,
                      ).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Clinic Information */}
        <div className="col-span-1 lg:col-span-2">
          <h2 className="text-xl font-bold text-blue-800 mb-3">
            <i className="pi pi-building mr-2"></i>
            Información de la Clínica
          </h2>
          <Divider className="my-2" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <table className="w-full border-collapse">
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-semibold w-1/3">Nombre:</td>
                  <td className="py-3">{AppoimentData?.clinic.name}</td>
                </tr>
              </tbody>
            </table>
            <table className="w-full border-collapse">
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-semibold w-1/3">Dirección:</td>
                  <td className="py-3">{AppoimentData?.clinic.address}</td>
                </tr>
              </tbody>
            </table>
            <table className="w-full border-collapse">
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-semibold w-1/3">RUC:</td>
                  <td className="py-3">{AppoimentData?.clinic.ruc}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Appointment Information */}
        <div className="col-span-1 lg:col-span-2">
          <h2 className="text-xl font-bold text-blue-800 mb-3">
            <i className="pi pi-calendar-plus mr-2"></i>
            Información de la Consulta
          </h2>
          <Divider className="my-2" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <table className="w-full border-collapse">
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-semibold w-1/3">
                    Hora de inicio de consulta:
                  </td>
                  <td className="py-3">
                    {AppoimentData?.checkInDateTime
                      ? new Date(
                          AppoimentData.checkInDateTime,
                        ).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <table className="w-full border-collapse">
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-semibold w-1/3">
                    Duracion de la consulta:
                  </td>
                  <td className="py-3">
                    {AppoimentData?.durationTimeSpan ?? "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Notas:</h3>
            <p className="whitespace-pre-wrap text-gray-700">
              {AppoimentData?.notes ?? "-"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default DetailAppointment
