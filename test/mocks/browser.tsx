import type { SetupWorker } from "msw"
import { setupWorker } from "msw"
import { handlers } from "./handlers"

/**
 * MSW worker instance for browser environments.
 * Used to intercept and mock API requests during development and testing.
 */
export const worker: SetupWorker = setupWorker(...handlers)
