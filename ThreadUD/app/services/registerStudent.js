import { API_URL } from "../constants/apiConfig";

export const registerStudent = async (studentData) => {
  try {
    console.log("API URL:", `${API_URL}/api/user/register`);
    console.log("Data being sent to backend:", studentData);

    const response = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    console.log("Raw response status:", response.status);

    if (!response.ok) {
      const errorData = await response.text(); // Log raw response
      console.error("Error response from backend:", errorData);
      throw new Error(errorData || "Registration failed.");
    }

    const responseData = await response.json(); // Parse the successful response
    console.log("Parsed response data:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error in registerStudent:", error);
    throw error;
  }
};
