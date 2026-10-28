import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs"
import finnHub from "../apis/finnHub"
import { WatchListContext } from "../context/watchlistContext"




export const StockList = () => {
  const [stock, setStock] = useState([])
  const [error, setError] = useState("")
  const { watchList, deleteStock } = useContext(WatchListContext)
  const navigate = useNavigate()


  const changeColor = (change) => {
    return change > 0 ? "success" : "danger"
  }

  const renderIcon = (change) => {
    return change > 0 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />
  }

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {

      // allSettled: one failing symbol does not hide the rest of the list
      const responses = await Promise.allSettled(watchList.map((stock) => {
        return finnHub.get("/quote", {
          params: {
            symbol: stock
          }
        })
      }))
      if (!isMounted) return

      const data = responses
        .filter((response) => response.status === "fulfilled")
        .map((response) => {
          return {
            data: response.value.data,
            symbol: response.value.config.params.symbol
          }
        })
      const failed = responses.length - data.length
      setStock(data)
      setError(failed > 0 ? `Could not load prices for ${failed} of ${responses.length} stocks. Check your API key and rate limit.` : "")
    }
    fetchData()

    return () => (isMounted = false)
  }, [watchList])

  const handleStockSelect = (symbol) => {
    navigate(`detail/${symbol}`)
  }


  return (<div>
    {error && <div className="alert alert-warning mt-4" role="alert">{error}</div>}
    <table className="table hover mt-5">
      <thead style={{ color: "rgb(79,89,102)" }}>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Last</th>
          <th scope="col">Chg</th>
          <th scope="col">Chg%</th>
          <th scope="col">High</th>
          <th scope="col">Low</th>
          <th scope="col">Open</th>
          <th scope="col">Pclose</th>

        </tr>
      </thead>
      <tbody>
        {stock.map((stockData) => {
          return (
            <tr style={{ cursor: "pointer" }} onClick={() => handleStockSelect(stockData.symbol)} className="table-row" key={stockData.symbol}>
              <th scope="row">{stockData.symbol}</th>
              <td>{stockData.data.c}</td>
              <td className={`text-${changeColor(stockData.data.d)}`}>{stockData.data.d} {renderIcon(stockData.data.d)}</td>
              <td className={`text-${changeColor(stockData.data.dp)}`}>{stockData.data.dp} {renderIcon(stockData.data.d)} </td>
              <td>{stockData.data.h}</td>
              <td>{stockData.data.l}</td>
              <td>{stockData.data.o}</td>
              <td>{stockData.data.pc} <button className="btn btn-danger btn-sm ml-3 d-inline-block delete-button" onClick={(e) => {
                e.stopPropagation()
                deleteStock(stockData.symbol)
              }}>Remove</button></td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>)
}