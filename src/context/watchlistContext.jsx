import { createContext, useState, useEffect } from "react"
import { parseWatchList } from "../utils/stocks"

export const WatchListContext = createContext()

export const WatchListContextProvider = (props) => {

  const [watchList, setWatchList] = useState(
    () => parseWatchList(localStorage.getItem("watchList"))
  )

  useEffect(() => {
    localStorage.setItem("watchList", JSON.stringify(watchList))
  }, [watchList])

  const addStock = (stock) => {
    if (watchList.indexOf(stock) === -1) {
      setWatchList([...watchList, stock])
    }

  }

  const deleteStock = (stock) => {
    setWatchList(watchList.filter((el) => {
      return el !== stock
    }))
  }

  return <WatchListContext.Provider value={{ watchList, addStock, deleteStock }}>
    {props.children}
  </WatchListContext.Provider>
}
