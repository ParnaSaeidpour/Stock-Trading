import { AutoComplete } from "../components/AutoComplete"
import { StockList } from "../components/StockList"
import trading from "../images/Tranding.png"
export const StockOverviewPage = () => {
  return <div>
    <div className="text-center" >
      <img src="https://www.kindpng.com/picc/m/78-788160_transparent-stock-market-icon-png-png-download.png" width="200" />
    </div>
    <AutoComplete />
    <StockList />
  </div>
}