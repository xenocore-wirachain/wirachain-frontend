export type ClinicRequest = {
  ruc: string
  address: string
}

export type ClinicResponse = ClinicRequest & {
  id: number
}
