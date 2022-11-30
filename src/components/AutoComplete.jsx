import {useState,useEffect,useContext} from "react"
import finnHub from "../apis/finnHub"
import {WatchListContext} from '../context/watchlistContext'


export const AutoComplete = () => {
  const [search, setSearch] = useState("")
  const [results,setResults] = useState([])
  const {addStock}= useContext(WatchListContext)
  

  const renderDropdown =() =>{
    const dropDownClass = search ? "show" :null
    return(
      <ul style={{
        cursor :"pointer",
        overflowY: "scroll",
        overflowX :"hidden",

      }}className={`drowppdown-menu ${dropDownClass}`}>
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
          setResults(response.data.result)
        }    
        
      } catch (err) {
        
      }
    }
    
    if(search.length >0){
      fetchData()
    }else{
      setResults([])
    }
    return()=> (isMounted =false)
    
  },[search])

  
  return <div className = "w-50 p-5 rounded mx-auto">
  <div className ="from-floating dropdown">
    <input  style ={{backgroundColor: "rgb(145,158,171,0.04"}} id= "search" type="text" className ="form-control" placeholder="Search" autoComplete="off" value ={search} onChange={(e)=> setSearch(e.target.value)} >
    </input>
    
    <label htmlFor="search"></label>
    {renderDropdown()}
  </div>

</div>
     
}

