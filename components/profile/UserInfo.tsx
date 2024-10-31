import React from "react";
import { View, Text } from "react-native";

interface UserInfoProps {
  email: string;
}

export const UserInfo: React.FC<UserInfoProps> = ({ email }) => (
  <View className="bg-gray-50 rounded-lg p-4 mb-6">
    <Text className="text-lg font-medium mb-1">Email</Text>
    <Text className="text-gray-600">{email}</Text>
  </View>
);
