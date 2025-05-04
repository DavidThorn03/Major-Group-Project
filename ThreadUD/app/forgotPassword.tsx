import React, { useEffect, useState } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { forgotPassword } from "./services/forgotPassword.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [code, setCode] = useState(0);
  const [showVerification, setShowVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const generateCode = async () => {
      const newCode = Math.floor(1000 + Math.random() * 9000);
      console.log("Generated code:", newCode);
      setCode(newCode);
    };
    generateCode();
  }, []);

  const sendEmail = async (inputText: string) => {
    if (!inputText || inputText.trim() === "") {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    console.log("Sending email...");
    console.log("Generated code:", code);
    setIsLoading(true);

    try {
      const emailToSend = inputText.toLowerCase();
      console.log("Preparing to send to:", emailToSend);

      const filter = { email: emailToSend, code: code };
      await forgotPassword(filter);

      console.log("Email successfully sent to:", emailToSend);
      setEmail(emailToSend);
      // Stop loading and immediately show verification UI
      setIsLoading(false);
      setText(""); // Clear input
      setShowVerification(true);
      Alert.alert("Success", "Email sent with verification code");
    } catch (error) {
      console.error("Error sending email:", error);
      Alert.alert("Error", "Failed to send email. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      // Ensure loading state is reset
      setIsLoading(false);
    }
  };

  const verify = async () => {
    if (!text || text.trim() === "") {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    console.log("Verifying code: Input:", text, "Expected:", code);

    try {
      if (parseInt(text) === code) {
        console.log("Code verified successfully!");
        Alert.alert(
          "Success",
          "Code verified. You can now reset your password."
        );
        router.push({
          pathname: "/resetPassword",
          params: { email },
        });
      } else {
        Alert.alert("Error", "Incorrect code. Please try again.");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      Alert.alert("Error", "Failed to verify code. Please try again.");
    }
  };

  const resetAndGoBack = () => {
    setText("");
    setShowVerification(false);
  };

  console.log("Current UI state:", {
    email,
    showVerification,
    isLoading,
    codeGenerated: code > 0,
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#3a4b5c" }}>
      <View
        style={{
          backgroundColor: "#1a2b61",
          marginBottom: 14,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          {showVerification ? "Enter Verification Code" : "Forgot Password"}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingTop: 80, paddingHorizontal: 16 }}
      >
        {!showVerification ? (
          <View style={{ width: "100%" }}>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                textAlign: "center",
                marginVertical: 16,
              }}
            >
              Enter your email to reset your password
            </Text>

            <TextInput
              onChangeText={(value) => setText(value)}
              value={text}
              placeholder="Enter your email"
              style={{
                backgroundColor: "white",
                borderColor: "#d1d5db",
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
                marginTop: 8,
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
              autoFocus={true}
            />

            <TouchableOpacity
              onPress={() => sendEmail(text)}
              disabled={isLoading}
              style={{
                backgroundColor: isLoading ? "#9ca3af" : "#3b82f6",
                padding: 16,
                borderRadius: 8,
                alignItems: "center",
                marginVertical: 8,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="white"
                  style={{ marginRight: 10 }}
                />
              )}
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ width: "100%" }}>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                textAlign: "center",
                marginVertical: 16,
              }}
            >
              Verification code sent to {email}
            </Text>

            <Text style={{ color: "white", fontSize: 14, marginBottom: 4 }}>
              Enter verification code
            </Text>

            <TextInput
              onChangeText={(value) => setText(value)}
              value={text}
              placeholder="Enter 4-digit code"
              style={{
                backgroundColor: "white",
                borderColor: "#d1d5db",
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
                marginTop: 8,
              }}
              keyboardType="numeric"
              autoFocus={true}
            />

            <TouchableOpacity
              onPress={verify}
              style={{
                backgroundColor: "#3b82f6",
                padding: 16,
                borderRadius: 8,
                alignItems: "center",
                marginVertical: 8,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Verify Code
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                color: "white",
                fontSize: 14,
                textAlign: "center",
                marginTop: 32,
              }}
            >
              Didn't receive the code?
            </Text>

            <TouchableOpacity
              onPress={() => sendEmail(email)}
              style={{
                backgroundColor: "#4b5563",
                padding: 16,
                borderRadius: 8,
                alignItems: "center",
                marginVertical: 8,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Resend Code
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={resetAndGoBack}
              style={{
                backgroundColor: "transparent",
                borderColor: "#d1d5db",
                borderWidth: 1,
                padding: 16,
                borderRadius: 8,
                alignItems: "center",
                marginVertical: 8,
              }}
            >
              <Text style={{ color: "white" }}>Back to Email Entry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ForgotPassword;
