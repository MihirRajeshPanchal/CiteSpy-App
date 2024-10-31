import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";

interface TopicInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  topicsCount: number;
}

export const TopicInput: React.FC<TopicInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  topicsCount,
}) => (
  <>
    <View className="flex-row items-center mb-4">
      <TextInput
        className="flex-1 bg-gray-100 rounded-lg px-4 py-2 mr-2"
        placeholder="Add research topic"
        value={value}
        onChangeText={onChangeText}
        maxLength={50}
        onSubmitEditing={onSubmit}
      />
      <TouchableOpacity
        onPress={onSubmit}
        className="bg-gray-900 rounded-lg px-4 py-2"
      >
        <Text className="text-white">Add</Text>
      </TouchableOpacity>
    </View>
    <Text className="text-sm text-gray-500 mb-4">Topics: {topicsCount}/20</Text>
  </>
);
