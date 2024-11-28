import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// Reusable container component
export const Container = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

// Reusable header component
export const Header = ({ children }) => (
  <Text style={styles.header}>{children}</Text>
);

// Reusable post card component
export const PostCard = ({ children }) => (
  <View style={styles.postCard}>{children}</View>
);

// Reusable thread name text
export const ThreadName = ({ children }) => (
  <Text style={styles.threadName}>{children}</Text>
);

// Reusable general text
export const GeneralText = ({ children }) => (
  <Text style={styles.text}>{children}</Text>
);

// Reusable button component
export const Button = ({ onPress, title }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
    backgroundColor: "#fff",
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
    color: "#68BBE3",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#68BBE3",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default styles;
