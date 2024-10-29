import React from 'react';
import { Animated, TextInput, TouchableOpacity, View, Keyboard, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SearchBarProps {
  onSubmit: (query: string) => void;
  isExpanded: boolean;
  onFocus: () => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar = ({ onSubmit, isExpanded, onFocus, onClear , placeholder}: SearchBarProps) => {
  const [query, setQuery] = React.useState('');
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const inputRef = React.useRef<TextInput>(null);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0],
  });

  const handleSubmit = () => {
    if (query.trim()) {
      onSubmit(query.trim());
      Keyboard.dismiss();
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear();
    inputRef.current?.focus();
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        zIndex: 1,
        position: 'relative',
      }}
      className="w-full px-4 py-2"
    >
      <View className="bg-white rounded-lg shadow-md">
        <View className="flex-row items-center p-3">
          <TouchableOpacity
            onPress={() => inputRef.current?.focus()}
            className="px-2"
          >
            <Feather name="search" size={20} color="#9ca3af" />
          </TouchableOpacity>
          
          <TextInput
            ref={inputRef}
            className="flex-1 text-base"
            placeholder={placeholder}
            value={query}
            onChangeText={setQuery}
            onFocus={onFocus}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="never"
            style={Platform.select({
              ios: { height: 24 },
              android: { paddingVertical: 8 },
            })}
          />
          
          {query.length > 0 && (
            <TouchableOpacity 
              onPress={handleClear}
              className="px-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};
