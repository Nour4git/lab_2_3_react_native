import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, login, register, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigation.replace("Home");
    }
  }, [isAuthenticated, loading, navigation]);

  const handleSubmit = async () => {
    setErrorMessage("");
    
    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return;
    }

    if (!isLogin && !name) {
      setErrorMessage("Name is required for registration");
      return;
    }

    setIsSubmitting(true);

    try {
      let result;

      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await register(email, password, name);
      }

      if (result.success) {
        navigation.replace("Home");
      } else {
        setErrorMessage(result.error?.message || "Authentication failed");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      console.error("Auth error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage("");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity 
          style={[styles.button, isSubmitting && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin ? "Login" : "Register"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchButton} onPress={toggleAuthMode}>
          <Text style={styles.switchText}>
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchButton: {
    marginTop: 15,
    alignItems: "center",
  },
  switchText: {
    color: "#007BFF",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default AuthScreen;