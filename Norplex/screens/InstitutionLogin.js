import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function InstitutionLogin() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institutionName, setInstitutionName] = useState("");

  const handleSubmit = async () => {
    if (isSignup) {
      // Signup - save in pending_approval
      try {
        const response = await fetch("http://localhost:5000/institution/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ institutionName, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
          Alert.alert("Signup Successful", "Your institution is pending approval.");
        } else {
          Alert.alert("Error", data.message || "Signup failed.");
        }
      } catch (error) {
        Alert.alert("Error", "Could not connect to server.");
      }
    } else {
      // Login
      try {
        const response = await fetch("http://localhost:5000/institution/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
          Alert.alert("Login Successful", `Welcome ${data.institutionName}`);
        } else {
          Alert.alert("Error", data.message || "Login failed.");
        }
      } catch (error) {
        Alert.alert("Error", "Could not connect to server.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSignup ? "Institution Signup" : "Institution Login"}
      </Text>

      {isSignup && (
        <TextInput
          style={styles.input}
          placeholder="Institution Name"
          value={institutionName}
          onChangeText={setInstitutionName}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isSignup ? "Sign Up" : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={styles.link}>
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: "#4B9CD3", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18 },
  link: { color: "#4B9CD3", marginTop: 15, textAlign: "center" },
});
