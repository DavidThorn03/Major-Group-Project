import axios from "axios";
import { API_URL } from "../../config/apiConfig";

export const registerStudent = async (studentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/students/register`,
      studentData
    );
    return response.data; // Return the success response
  } catch (error) {
    console.error(
      "Error registering student:",
      error.response?.data || error.message
    );
    throw (
      error.response?.data || {
        message: "An error occurred during registration.",
      }
    );
  }
};
