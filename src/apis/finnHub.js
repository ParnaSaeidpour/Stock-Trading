import axios from "axios";

// The API key is read from .env (VITE_FINNHUB_API_KEY), never from the source code.
// Note: Vite puts VITE_* variables into the browser bundle, so only use a free key
// that is safe to expose to users of the app.
const TOKEN = import.meta.env.VITE_FINNHUB_API_KEY

export default axios.create({
  baseURL: "https://finnhub.io/api/v1",
  params:{
    token : TOKEN
  }
})
