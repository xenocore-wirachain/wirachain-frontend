export type ClinicRequest = {
  ruc: string
  name: string
  address: string
}

export type ClinicResponse = ClinicRequest & {
  id: number
}
