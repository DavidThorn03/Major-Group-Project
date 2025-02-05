import { StyleSheet } from "react-native";

const ThreadStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 10,
  },
  header: {
    backgroundColor: "#3498db",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  joinButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  joinButtonText: {
    color: "#3498db",
    fontWeight: "bold",
  },
  postCard: {
    backgroundColor: "white",
    marginBottom: 10,
    padding: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  author: {
    fontWeight: "bold",
    fontSize: 16,
  },
  timestamp: {
    color: "gray",
    fontSize: 12,
  },
  content: {
    marginVertical: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  likeButton: {
    backgroundColor: "#ecf0f1",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  likeButtonText: {
    color: "#3498db",
    fontWeight: "bold",
  },
});

export default ThreadStyles;
