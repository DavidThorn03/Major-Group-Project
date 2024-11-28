import { StyleSheet } from "react-native";

const IndexStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  postCard: {
    backgroundColor: "#68BBE3",
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
    fontSize: 16,
    fontWeight: "bold",
  },
  author: {
    fontSize: 14,
    color: "#555",
    marginVertical: 4,
  },
  postContent: {
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    marginTop: 16,
    alignItems: "center",
  },
});

export default IndexStyles;
