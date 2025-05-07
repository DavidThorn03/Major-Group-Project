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
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [code, setCode] = useState(0);
  const [showVerification, setShowVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // generate a 4-digit code once
  useEffect(() => {
    const newCode = Math.floor(1000 + Math.random() * 9000);
    console.log("Generated code:", newCode);
    setCode(newCode);
  }, []);

  const sendEmail = (inputText: string) => {
    if (!inputText.trim()) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    const emailToSend = inputText.toLowerCase();

    // 1) go to the verification UI right away
    setEmail(emailToSend);
    setText("");
    setShowVerification(true);
    setIsLoading(true);

    // 2) fire & forget the API call
    const filter = { email: emailToSend, code };
    forgotPassword(filter)
      .then((data) => {
        console.log("Email sent:", data);
        Alert.alert("Success", "Email sent with verification code");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        // roll back if it fails
        setShowVerification(false);
        Alert.alert("Error", "Failed to send email. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const verify = () => {
    if (!text.trim()) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }
    if (parseInt(text, 10) === code) {
      Alert.alert("Success", "Code verified. You can now reset your password.");
      router.push({
        pathname: "/resetPassword",
        params: { email },
      });
    } else {
      Alert.alert("Error", "Incorrect code. Please try again.");
    }
  };

  const resetAndGoBack = () => {
    setText("");
    setShowVerification(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1a2b61" }}>
    
    <View style={{ flex: 1, backgroundColor: "#3a4b5c" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#1a2b61",
          height: 64,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          {showVerification ? "Enter Verification Code" : "Forgot Password"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 80 }}>
        {!showVerification ? (
          /* STEP 1: Email Entry */
          <View style={{ width: "100%" }}>
            <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>
              Enter your email to reset your password
            </Text>
            <TextInput
              style={{
                backgroundColor: "white",
                borderColor: "#d1d5db",
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                marginVertical: 16,
              }}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={text}
              onChangeText={setText}
              editable={!isLoading}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={() => sendEmail(text)}
            />
            <TouchableOpacity
              onPress={() => sendEmail(text)}
              disabled={isLoading}
              style={{
                backgroundColor: isLoading ? "#9ca3af" : "#3b82f6",
                padding: 16,
                borderRadius: 8,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="white"
                  style={{ marginRight: 8 }}
                />
              )}
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* STEP 2: Code Verification */
          <View style={{ width: "100%" }}>
            <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>
              Verification code sent to {email}
            </Text>
            <TextInput
              style={{
                backgroundColor: "white",
                borderColor: "#d1d5db",
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                marginVertical: 16,
              }}
              placeholder="Enter 4-digit code"
              keyboardType="numeric"
              value={text}
              onChangeText={setText}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={verify}
            />
            <TouchableOpacity
              onPress={verify}
              style={{
                backgroundColor: "#3b82f6",
                padding: 16,
                borderRadius: 8,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Verify Code
              </Text>
            </TouchableOpacity>
            <Text style={{ color: "white", textAlign: "center" }}>
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
                borderColor: "#d1d5db",
                borderWidth: 1,
                padding: 16,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white" }}>Back to Email Entry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
