import {useState,useEffect,useContext} from "react"
import finnHub from "../apis/finnHub"
import {WatchListContext} from '../context/watchlistContext'


export const AutoComplete = () => {
  const [search, setSearch] = useState("")
  const [results,setResults] = useState([])
  const {addStock}= useContext(WatchListContext)
  

  const renderDropdown =() =>{
    const dropDownClass = search && results.length > 0 ? "show" :null
    return(
      <ul style={{
        cursor :"pointer",
        overflowY: "scroll",
        overflowX :"hidden",

      }}className={`dropdown-menu ${dropDownClass}`}>
        {results.map((result)=>{
        return(
        <li onClick={() =>{addStock(result.symbol)
                          setSearch("")
                          }}
          
          key={result.symbol} className="dropdown-item">{result.description}({result.symbol})</li>
        )
        }
        
                    
        )}
      </ul>
    )
    
  }

  useEffect(()=>{
    let isMounted =true
    const fetchData = async()=>{
      try {
        const response = await finnHub.get("/search",{
          params: {
            q:search
          }
        })
        if(isMounted){
          setResults(response.data.result || [])
        }

      } catch (err) {
        if(isMounted){
          setResults([])
        }
      }
    }
    
    // Wait until the user stops typing, so each keystroke does not use up the API rate limit
    let timer
    if(search.length >0){
      timer = setTimeout(fetchData, 300)
    }else{
      setResults([])
    }
    return()=> {
      isMounted =false
      clearTimeout(timer)
    }
    
  },[search])

  
  return <div className = "w-50 p-5 rounded mx-auto">
  <div className ="form-floating dropdown">
    <input  style ={{backgroundColor: "rgba(145,158,171,0.04)"}} id= "search" type="text" className ="form-control" placeholder="Search" autoComplete="off" value ={search} onChange={(e)=> setSearch(e.target.value)} >
    </input>
    
    <label htmlFor="search">Search stocks</label>
    {renderDropdown()}
  </div>

</div>
     
}

