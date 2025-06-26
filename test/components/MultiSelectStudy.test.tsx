import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import MultiSelectStudy from "../../src/components/MultiSelectStudy"
import * as Redux from "../../src/redux"

// Mock the MultiSelect component
vi.mock("primereact/multiselect", () => ({
  MultiSelect: vi.fn(({ options, virtualScrollerOptions, ...props }) => (
    <div data-testid="mock-multiselect">
      <select {...props}>
        {options?.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div data-testid="mock-virtual-scroller">
        {virtualScrollerOptions?.loading ? "Loading..." : ""}
      </div>
    </div>
  )),
}))

// Mock Redux functions
vi.mock("../../src/redux", () => ({
  useGetAllSpecialitiesQuery: vi.fn(),
}))

describe("MultiSelectStudy Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("renders MultiSelect component with no options when no data", () => {
    // Mock the Redux query to return no results
    vi.mocked(Redux.useGetAllSpecialitiesQuery).mockReturnValue({
      data: undefined,
      isFetching: false,
      refetch: vi.fn(),
    } as any)

    render(<MultiSelectStudy />)

    // Use standard assertions instead of toBeInTheDocument()
    expect(screen.getByTestId("mock-multiselect")).toBeDefined()
    expect(screen.getByTestId("mock-virtual-scroller")).toBeDefined()
    expect(screen.getByTestId("mock-virtual-scroller").textContent).toBe("")
  })

  test("renders MultiSelect component with options from API data", () => {
    // Mock API data
    const mockStudies = {
      results: [
        { id: 1, name: "Study 1" },
        { id: 2, name: "Study 2" },
      ],
      totalPages: 1,
      totalResults: 2,
    }

    // Mock the Redux query to return results
    vi.mocked(Redux.useGetAllSpecialitiesQuery).mockReturnValue({
      data: mockStudies,
      isFetching: false,
      refetch: vi.fn(),
    } as any)

    render(<MultiSelectStudy />)

    expect(screen.getByTestId("mock-multiselect")).toBeDefined()
    expect(screen.getAllByRole("option").length).toBe(2)
    expect(screen.getAllByRole("option")[0].textContent).toBe("Study 1")
    expect(screen.getAllByRole("option")[1].textContent).toBe("Study 2")
  })

  test("shows loading state in virtual scroller", () => {
    // Mock the Redux query to return with loading state
    vi.mocked(Redux.useGetAllSpecialitiesQuery).mockReturnValue({
      data: undefined,
      isFetching: true,
      refetch: vi.fn(),
    } as any)

    render(<MultiSelectStudy />)

    expect(screen.getByTestId("mock-virtual-scroller").textContent).toBe(
      "Loading...",
    )
  })

  test("does not duplicate items when data is updated", async () => {
    // Initial state with 2 items
    const initialData = {
      results: [
        { id: 1, name: "Study 1" },
        { id: 2, name: "Study 2" },
      ],
      totalPages: 1,
      totalResults: 2,
    }

    // Mock the Redux query to return initial results
    const mockQuery = vi.mocked(Redux.useGetAllSpecialitiesQuery)
    mockQuery.mockReturnValue({
      data: initialData,
      isFetching: false,
      refetch: vi.fn(),
    } as any)

    const { rerender } = render(<MultiSelectStudy />)

    // Update with the same data plus one new item
    const updatedData = {
      results: [
        { id: 1, name: "Study 1" },
        { id: 2, name: "Study 2" },
        { id: 3, name: "Study 3" },
      ],
      totalPages: 1,
      totalResults: 3,
    }

    // Mock the Redux query to return updated results
    mockQuery.mockReturnValue({
      data: updatedData,
      isFetching: false,
      refetch: vi.fn(),
    } as any)

    // Re-render the component with updated props
    rerender(<MultiSelectStudy />)

    // Wait for effect to run
    await vi.waitFor(() => {
      // Should have 3 options, not 5 (which would mean duplication)
      expect(screen.getAllByRole("option").length).toBe(3)
    })
  })
})
