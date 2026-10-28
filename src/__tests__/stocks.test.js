import { describe, expect, it } from "vitest"
import { DEFAULT_WATCHLIST, chartColor, formatData, parseWatchList, startOfLastTradingDay } from "../utils/stocks"

describe("parseWatchList", () => {
  it("uses the default list when nothing is saved", () => {
    expect(parseWatchList(null)).toEqual(DEFAULT_WATCHLIST)
  })

  it("reads the saved JSON list", () => {
    expect(parseWatchList('["AAPL","TSLA"]')).toEqual(["AAPL", "TSLA"])
  })

  it("keeps an empty list after the user removed every stock (no blank row)", () => {
    expect(parseWatchList("[]")).toEqual([])
    expect(parseWatchList("")).toEqual([])
  })

  it("still reads the old comma-separated format", () => {
    expect(parseWatchList("GOOGL,MSFT")).toEqual(["GOOGL", "MSFT"])
  })

  it("drops empty and invalid entries", () => {
    expect(parseWatchList('["AAPL","",null,"  "]')).toEqual(["AAPL"])
  })
})

describe("formatData", () => {
  it("converts Finnhub candles to chart points in milliseconds", () => {
    const data = { s: "ok", t: [1700000000, 1700003600], c: [101.7, 103.2] }
    expect(formatData(data)).toEqual([
      { x: 1700000000000, y: 101 },
      { x: 1700003600000, y: 103 },
    ])
  })

  it("returns an empty list when Finnhub has no data", () => {
    expect(formatData({ s: "no_data" })).toEqual([])
    expect(formatData(undefined)).toEqual([])
  })
})

describe("chartColor", () => {
  it("is green when the price went up and red when it went down", () => {
    expect(chartColor([{ y: 100 }, { y: 110 }])).toBe("#26C281")
    expect(chartColor([{ y: 110 }, { y: 100 }])).toBe("#ed3419")
  })

  it("does not crash on empty data", () => {
    expect(chartColor([])).toBe("#26C281")
  })
})

describe("startOfLastTradingDay", () => {
  const seconds = (date) => Math.floor(date.getTime() / 1000)
  const day = 24 * 60 * 60

  it("goes back one day on a weekday", () => {
    const wednesday = new Date(2026, 9, 28, 12)
    expect(startOfLastTradingDay(wednesday)).toBe(seconds(wednesday) - day)
  })

  it("goes back to Friday on Saturday and Sunday", () => {
    const saturday = new Date(2026, 9, 31, 12)
    const sunday = new Date(2026, 10, 1, 12)
    expect(startOfLastTradingDay(saturday)).toBe(seconds(saturday) - 2 * day)
    expect(startOfLastTradingDay(sunday)).toBe(seconds(sunday) - 3 * day)
  })
})
