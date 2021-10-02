import axios from "axios";
const instance = axios.create({
  baseURL: "https://whatsapp-backend-9nns9.ondigitalocean.app",
});
export default instance;
