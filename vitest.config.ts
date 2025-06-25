/// <reference types="vitest/config" />
import { defineConfig } from "vite"

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    deps: { inline: ["msw"] },
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/setupTests.ts"],
    },
  },
})
