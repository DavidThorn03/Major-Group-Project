import axios from "axios";
import IP from "../../config/IPAddress";

export const updateProfile = async (filters = {}) => {
  console.log("filters", filters);
  try {
    const response = await axios.put(`${IP}/user/update`, filters);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
