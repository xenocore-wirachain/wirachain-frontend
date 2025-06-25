import { describe, expect, it } from "vitest"
import { API_URL, BASE_PATH } from "../../src/utils/ApiPath"

describe("ApiPath", () => {
  describe("API_URL", () => {
    it("should export API_URL as a non-empty string", () => {
      // Verify it's a string
      expect(typeof API_URL).toBe("string")

      // Verify it's not empty
      expect(API_URL).not.toBe("")

      // Optional: You can test for a specific pattern if it should follow one
      expect(API_URL).toMatch(/^https?:\/\//)
    })
  })

  describe("BASE_PATH", () => {
    it("should export correct base path enum values", () => {
      // All values should be defined
      expect(BASE_PATH.clinic).toBe("clinics")
      expect(BASE_PATH.clinicAdministration).toBe("clinicadministrators")
      expect(BASE_PATH.doctor).toBe("doctors")
      expect(BASE_PATH.study).toBe("medicaltests")
      expect(BASE_PATH.speciality).toBe("medicalspecialties")
      expect(BASE_PATH.patient).toBe("patients")
      expect(BASE_PATH.medicalConsultation).toBe("medicalconsultations")
    })

    it("should have all required path values", () => {
      // Make sure the enum has all the expected keys
      const expectedKeys = [
        "clinic",
        "clinicAdministration",
        "doctor",
        "study",
        "speciality",
        "patient",
        "medicalConsultation",
      ]

      expectedKeys.forEach(key => {
        expect(BASE_PATH).toHaveProperty(key)
      })
    })
  })
})
