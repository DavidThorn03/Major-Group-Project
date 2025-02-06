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
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  joinButtonText: {
    color: "white",
    fontWeight: "bold",
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
  buttonContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  joinedButton: {
    backgroundColor: "#808080",
    padding: 10,
    borderRadius: 5,
  },
  joinedButtonText: {
    color: "black",
    fontWeight: "bold",
  },
});

export default ThreadStyles;
