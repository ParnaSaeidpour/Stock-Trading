import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import finnHub from "../apis/finnHub"
import { StockChart } from "../components/StockChart"
import { StockData } from "../components/StockData"
import { formatData, startOfLastTradingDay } from "../utils/stocks"

export const StockDetailPage = () => {
  const [chartData, setChartData] = useState()
  const [chartError, setChartError] = useState("")
  const { symbol } = useParams()
  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      const date = new Date()
      const currentTime = Math.floor(date.getTime() / 1000)
      const oneDay = startOfLastTradingDay(date)
      const oneWeek = currentTime - 7 * 24 * 60 * 60
      const oneYear = currentTime - 365 * 24 * 60 * 60

      try {
        const responses = await Promise.all([finnHub.get("/stock/candle", {
          params: {
            symbol,
            from: oneDay,
            to: currentTime,
            resolution: 30
          }
        }), finnHub.get("/stock/candle", {
          params: {
            symbol,
            from: oneWeek,
            to: currentTime,
            resolution: 60
          }
        }), finnHub.get("/stock/candle", {
          params: {
            symbol,
            from: oneYear,
            to: currentTime,
            resolution: "W"
          }
        })])

        const data = {
          day: formatData(responses[0].data),
          week: formatData(responses[1].data),
          year: formatData(responses[2].data)
        }
        if (!isMounted) return
        if (data.day.length === 0 && data.week.length === 0 && data.year.length === 0) {
          setChartError("No price history available for this stock.")
        } else {
          setChartData(data)
        }
      } catch (err) {
        if (isMounted) {
          setChartError("Price chart could not be loaded. Your Finnhub plan may not include price history.")
        }
      }
    }
    fetchData()
    return () => (isMounted = false)
  }, [symbol])


  return <div>
    {chartData && <StockChart chartData={chartData} symbol={symbol} />}
    {chartError && <div className="alert alert-warning mt-5" role="alert">{chartError}</div>}
    <StockData symbol={symbol} />
  </div>
}
