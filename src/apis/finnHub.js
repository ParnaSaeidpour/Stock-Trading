import axios from "axios";
const TOKEN ="cdtj64aad3i41v7hr760cdtj64aad3i41v7hr76g"

export default axios.create({
  baseURL: "https://finnhub.io/api/v1",
  params:{
    token : TOKEN
  }
})