import axios from "axios";
import { getAuthHeaders } from "./auth";

export const getUserProfile = async () => {
  const res = await axios.get(
    "http://127.0.0.1:8000/api/profile/me/",
    getAuthHeaders()
  );
  return res.data;
};
