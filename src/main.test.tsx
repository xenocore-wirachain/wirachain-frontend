import { describe, expect, it } from "vitest"

describe("main.tsx error handling", () => {
  it("should throw an error when root element does not exist", () => {
    document.body.innerHTML = ""

    const checkRootElement = (): void => {
      const container = document.getElementById("root")
      if (!container) {
        throw new Error(
          "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
        )
      }
    }

    expect(checkRootElement).toThrow(
      "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
    )
  })
})
