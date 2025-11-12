import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import LogoutButton from "../components/LogoutButton";

const HomeScreen = ({ navigation }) => {
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigation.replace("Auth");
    }
  }, [isAuthenticated, loading, navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton navigation={navigation} />,
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {user?.name || "User"}!</Text>
      <Text style={styles.subtitle}>
        You can create, view, and manage your personal notes.
      </Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Notes")}
      >
        <Text style={styles.buttonText}>View My Notes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate("Notes")}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          Create New Note
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    color: "#666",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007BFF",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButtonText: {
    color: "#007BFF",
  },
});

export default HomeScreen;