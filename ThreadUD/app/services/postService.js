import axios from "axios";

export const createPost = async (
  IP: string,
  selectedThread: string,
  body: string,
  userEmail: string
) => {
  try {
    const response = await axios.post(`${IP}/thread/${selectedThread}/posts`, {
      content: body,
      author: userEmail,
    });

    return response.data; // Return the response data if needed
  } catch (error) {
    console.error("Error creating post:", error);
    throw error; // Re-throw the error if you want to handle it in the component
  }
};
