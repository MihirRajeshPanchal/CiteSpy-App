import React, { useState } from "react";
import { Button, TextInput, Text, View, TouchableOpacity } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";

export default function RegisterScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = () => {
    createUserWithEmailAndPassword(getAuth(), email, password)
      .then((user) => {
        if (user) router.replace("/(tabs)");
      })
      .catch((err) => {
        alert(err?.message);
      });
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-2xl font-bold mb-8 text-gray-800">Register</Text>
      <TextInput
        className="bg-white rounded-lg shadow-sm p-4 mb-4 w-4/5"
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        placeholderTextColor="#9ca3af"
      />
      <TextInput
        className="bg-white rounded-lg shadow-sm p-4 mb-6 w-4/5"
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        placeholderTextColor="#9ca3af"
      />
      <TouchableOpacity
        onPress={handleRegister}
        style={{
          backgroundColor: '#1F2937',
          padding: 12,
          borderRadius: 8,
          width: '80%',
          marginBottom: 24,
          alignItems: 'center',
        }}
        accessibilityLabel="Register button"
      >
        <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text className="text-gray-600 mt-4">
          Already have an account? <Text className="text-blue-500">Log in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
