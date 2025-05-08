type Gender = {
  id: number
  value: string
  code: string
}

export const GenderDictionary: Gender[] = [
  { id: 1, value: "Hombre", code: "male" },
  { id: 2, value: "Mujer", code: "female" },
]

export const USER_TYPES = {
  ADMIN: 1,
  DOCTOR: 2,
  PATIENT: 3,
  CLINIC: 4, // Assuming clinic admin is type 4
}
