// api/publicApi.js
import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://localhost:5000/api",
  // no interceptors
});

export default publicApi;
