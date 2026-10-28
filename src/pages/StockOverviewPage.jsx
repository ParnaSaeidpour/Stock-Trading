import { BsGraphUp } from "react-icons/bs"
import { AutoComplete } from "../components/AutoComplete"
import { StockList } from "../components/StockList"
export const StockOverviewPage = () => {
  return <div>
    <h1 className="text-center mt-4">
      <BsGraphUp className="text-success me-2" />
      Stock Watchlist
    </h1>
    <AutoComplete />
    <StockList />
  </div>
}
