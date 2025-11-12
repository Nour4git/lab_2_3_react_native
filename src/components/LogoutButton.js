import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useAuth } from "../contexts/AuthContext";

const LogoutButton = ({ navigation }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await logout();
              if (result.success) {
                navigation.replace("Auth");
              }
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.buttonText}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#f44336",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default LogoutButton;