export const DEFAULT_WATCHLIST = ["GOOGL", "MSFT", "AMZN"]

// Read the saved watch list from localStorage. Empty or broken values fall back to the default.
export const parseWatchList = (saved) => {
  if (saved === null || saved === undefined) return DEFAULT_WATCHLIST
  try {
    const list = JSON.parse(saved)
    if (Array.isArray(list)) return list.filter((s) => typeof s === "string" && s.trim() !== "")
  } catch {
    // Older versions saved a comma-separated string
    return saved.split(",").map((s) => s.trim()).filter(Boolean)
  }
  return DEFAULT_WATCHLIST
}

// Convert a Finnhub candle response into chart points. Returns [] when there is no data.
export const formatData = (data) => {
  if (!data || data.s !== "ok" || !Array.isArray(data.t) || !Array.isArray(data.c)) return []
  return data.t.map((el, index) => {
    return {
      x: el * 1000,
      y: Math.floor(data.c[index])
    }
  })
}

// Green when the price went up over the period, red otherwise
export const chartColor = (points) => {
  if (points.length < 2) return "#26C281"
  return points[points.length - 1].y - points[0].y > 0 ? "#26C281" : "#ed3419"
}

// Start of the "last trading day" window: on weekends go back to Friday
export const startOfLastTradingDay = (date) => {
  const currentTime = Math.floor(date.getTime() / 1000)
  const day = 24 * 60 * 60
  if (date.getDay() === 6) return currentTime - 2 * day
  if (date.getDay() === 0) return currentTime - 3 * day
  return currentTime - day
}
