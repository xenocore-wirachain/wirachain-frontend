import { describe, expect, it } from "vitest"
import { GenderDictionary, USER_TYPES } from "../../src/utils/StaticVariables"

describe("StaticVariables", () => {
  describe("GenderDictionary", () => {
    it("should contain the correct gender entries", () => {
      // Verify array length
      expect(GenderDictionary).toHaveLength(2)

      // Verify male entry
      expect(GenderDictionary).toContainEqual({
        id: 1,
        value: "Hombre",
        code: "male",
      })

      // Verify female entry
      expect(GenderDictionary).toContainEqual({
        id: 2,
        value: "Mujer",
        code: "female",
      })
    })

    it("should have the correct structure for each gender entry", () => {
      GenderDictionary.forEach(gender => {
        expect(gender).toHaveProperty("id")
        expect(gender).toHaveProperty("value")
        expect(gender).toHaveProperty("code")

        expect(typeof gender.id).toBe("number")
        expect(typeof gender.value).toBe("string")
        expect(typeof gender.code).toBe("string")
      })
    })
  })

  describe("USER_TYPES", () => {
    it("should define all required user types with correct values", () => {
      // Verify all user types
      expect(USER_TYPES.ADMIN).toBe(1)
      expect(USER_TYPES.DOCTOR).toBe(2)
      expect(USER_TYPES.PATIENT).toBe(3)
      expect(USER_TYPES.CLINIC).toBe(4)
    })

    it("should have unique values for each user type", () => {
      // Get all values
      const values = Object.values(USER_TYPES)
      const uniqueValues = new Set(values)

      // Verify all values are unique (set size matches values array length)
      expect(uniqueValues.size).toBe(values.length)
    })

    it("should contain all required user type keys", () => {
      // Verify all expected keys exist
      expect(USER_TYPES).toHaveProperty("ADMIN")
      expect(USER_TYPES).toHaveProperty("DOCTOR")
      expect(USER_TYPES).toHaveProperty("PATIENT")
      expect(USER_TYPES).toHaveProperty("CLINIC")
    })
  })
})
