import axios from "axios";

const API = axios.create({ baseURL: "https://api.jikan.moe/v3/search/anime" });

export default API;
