import axios from "axios";

const baseURL = "https://back-end-images.herokuapp.com/v1/";

export default axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });
  