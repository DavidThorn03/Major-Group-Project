import { StyleSheet } from "react-native";

const IndexStyles = StyleSheet.create({
  postCard: {
    backgroundColor: "#E0F7FA",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  threadName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796B",
  },
  postContent: {
    fontSize: 16,
    color: "#333",
    marginVertical: 8,
  },
  author: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

export default IndexStyles;
