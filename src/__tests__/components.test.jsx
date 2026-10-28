import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import finnHub from "../apis/finnHub"
import { StockList } from "../components/StockList"
import { StockDetailPage } from "../pages/StockDetailPage"
import { WatchListContextProvider } from "../context/watchlistContext"

// Charts need a real browser canvas; a placeholder is enough for these tests
vi.mock("react-apexcharts", () => ({ default: () => <div data-testid="chart" /> }))

const quote = (symbol, c, d) => ({ data: { c, d, dp: d, h: c + 1, l: c - 1, o: c - 0.5, pc: c - d }, config: { params: { symbol } } })

const renderWithProviders = (ui, path = "/") =>
  render(
    <WatchListContextProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/" element={ui} />
          <Route path="/detail/:symbol" element={<StockDetailPage />} />
        </Routes>
      </MemoryRouter>
    </WatchListContextProvider>
  )

beforeEach(() => {
  localStorage.setItem("watchList", JSON.stringify(["AAPL", "MSFT"]))
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  localStorage.clear()
})

describe("StockList", () => {
  it("shows a row with the latest price for each stock", async () => {
    vi.spyOn(finnHub, "get").mockImplementation(async (_url, { params }) =>
      params.symbol === "AAPL" ? quote("AAPL", 190, 2) : quote("MSFT", 410, -3)
    )
    renderWithProviders(<StockList />)

    expect(await screen.findByText("AAPL")).toBeTruthy()
    expect(screen.getByText("MSFT")).toBeTruthy()
    expect(screen.getByText("190")).toBeTruthy()
  })

  it("still shows the other stocks when one request fails", async () => {
    vi.spyOn(finnHub, "get").mockImplementation(async (_url, { params }) => {
      if (params.symbol === "MSFT") throw new Error("429 Too Many Requests")
      return quote("AAPL", 190, 2)
    })
    renderWithProviders(<StockList />)

    expect(await screen.findByText("AAPL")).toBeTruthy()
    expect(screen.queryByText("MSFT")).toBeNull()
    expect(screen.getByRole("alert").textContent).toContain("1 of 2")
  })

  it("removes a stock and saves the list", async () => {
    vi.spyOn(finnHub, "get").mockImplementation(async (_url, { params }) => quote(params.symbol, 100, 1))
    renderWithProviders(<StockList />)

    await screen.findByText("AAPL")
    fireEvent.click(screen.getAllByText("Remove")[0])

    await waitFor(() => expect(JSON.parse(localStorage.getItem("watchList"))).toEqual(["MSFT"]))
  })
})

describe("StockDetailPage", () => {
  it("shows company info and a message when the chart cannot be loaded", async () => {
    vi.spyOn(finnHub, "get").mockImplementation(async (url) => {
      if (url === "/stock/candle") throw new Error("403 You don't have access to this resource")
      return { data: { name: "Apple Inc", ticker: "AAPL", country: "US" } }
    })
    renderWithProviders(<div />, "/detail/AAPL")

    expect(await screen.findByText("Apple Inc")).toBeTruthy()
    expect(screen.getByText(/Price chart could not be loaded/)).toBeTruthy()
    expect(screen.queryByTestId("chart")).toBeNull()
  })

  it("shows the chart when price history is available", async () => {
    vi.spyOn(finnHub, "get").mockImplementation(async (url) => {
      if (url === "/stock/candle") return { data: { s: "ok", t: [1700000000, 1700003600], c: [100, 105] } }
      return { data: { name: "Apple Inc", ticker: "AAPL" } }
    })
    renderWithProviders(<div />, "/detail/AAPL")

    expect(await screen.findByTestId("chart")).toBeTruthy()
    expect(screen.queryByText(/could not be loaded/)).toBeNull()
  })
})
