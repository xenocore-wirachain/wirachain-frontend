export type ClinicRequest = {
  ruc: number
  name: string
  address: string
}

export type ClinicResponse = ClinicRequest & {
  id: number
}
