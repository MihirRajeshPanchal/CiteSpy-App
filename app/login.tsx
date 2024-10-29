import React, { useState } from 'react';
import { Button, TextInput, View, Text, TouchableOpacity } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    signInWithEmailAndPassword(getAuth(), email, password)
      .then((user) => {
        if (user) router.replace('/(tabs)');
      })
      .catch((err) => {
        alert(err?.message);
      });
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-2xl font-bold mb-8 text-gray-800">Login</Text>
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
        onPress={handleLogin}
        style={{
          backgroundColor: '#1F2937',
          padding: 12,
          borderRadius: 8,
          width: '80%',
          marginBottom: 24,
          alignItems: 'center',
        }}
        accessibilityLabel="Login button"
      >
        <Text style={{ color: '#E5E7EB', fontSize: 16 }}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/register')}>
        <Text className="text-gray-600 mt-4">
          Don't have an account? <Text className="text-blue-500">Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
