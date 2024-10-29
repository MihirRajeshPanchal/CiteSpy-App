import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface InterestBubbleProps {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export const InterestBubble: React.FC<InterestBubbleProps> = ({ 
  label, 
  isSelected, 
  onToggle,
  onDelete
}) => (
  <TouchableOpacity
    onPress={onToggle}
    className={`m-2 px-6 py-3 rounded-full border flex-row items-center ${
      isSelected ? 'bg-gray-600 border-gray-700' : 'bg-gray-100 border-gray-200'
    }`}
  >
    <Text className={`text-base ${isSelected ? 'text-white' : 'text-gray-700'}`}>
      {label}
    </Text>
    <TouchableOpacity 
      onPress={onDelete} 
      className="ml-2"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <MaterialIcons 
        name="close" 
        size={20} 
        color={isSelected ? "white" : "#4B5563"} 
      />
    </TouchableOpacity>
  </TouchableOpacity>
);