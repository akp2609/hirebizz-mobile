import { useState } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { resetPasswordReq } from "../../api/auth";

const ResetPassword = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await resetPasswordReq(email);
      Alert.alert("✅ Reset link sent", "Check your inbox.");
    } catch (err) {
      console.log("Reset email failed", err);
      Alert.alert("⚠️ Error", "Unable to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.outer}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.card}>
          <Feather name="lock" size={40} color="#4B9EFF" style={styles.icon} />

          <Text style={styles.title}>🔐 Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email below and we’ll send you a magic reset link.
          </Text>

          <TextInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#888"
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
            Already have an account? <Text style={{ fontWeight: "bold" }}>Login</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: "#4B9EFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#ffffffcc",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    alignItems: "center",
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#dcdde1",
  },
  button: {
    backgroundColor: "#4B9EFF",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    fontSize: 14,
    color: "#636e72",
  },
});
