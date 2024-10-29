import { Button, Image, Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function LandingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Image
        source={require("../assets/logo.png")}
        className="w-50 h-40 mb-6"
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold mb-8 text-gray-800">Welcome to Our App</Text>

      <TouchableOpacity
        onPress={() => router.push("/login")}
        accessibilityLabel="Login button"
        style={{
          backgroundColor: '#E5E7EB',
          padding: 12,
          borderRadius: 8,
          width: '80%',
          marginBottom: 16,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#1F2937', fontWeight: 'bold' }}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/register")}
        accessibilityLabel="Register button"
        style={{
          backgroundColor: '#E5E7EB',
          padding: 12,
          borderRadius: 8,
          width: '80%',
          marginBottom: 24,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#1F2937', fontWeight: 'bold' }}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text className="text-gray-600 mt-4">
          Already signed in? <Text className="text-blue-500">Log in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
 