import React, { useRef, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface InterestSliderProps {
  interests: string[];
  selectedInterest: string;
  onInterestChange: (interest: string) => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
};

export function InterestSlider({
  interests,
  selectedInterest,
  onInterestChange,
}: InterestSliderProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const bounceValue = useSharedValue(0);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const maxOffset = contentWidth - SCREEN_WIDTH;

    if (offsetX <= 0) {
      bounceValue.value = withSpring(20, SPRING_CONFIG);
      setTimeout(() => {
        bounceValue.value = withSpring(0, SPRING_CONFIG);
      }, 200);
    } else if (offsetX >= maxOffset) {
      bounceValue.value = withSpring(-20, SPRING_CONFIG);
      setTimeout(() => {
        bounceValue.value = withSpring(0, SPRING_CONFIG);
      }, 200);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: bounceValue.value }],
  }));

  return (
    <View className="w-full bg-white shadow-md py-4">
      <Animated.View style={animatedStyle}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row px-4"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={(width) => setContentWidth(width)}
        >
          {interests.map((interest, index) => (
            <TouchableOpacity
              key={interest}
              onPress={() => onInterestChange(interest)}
              className={`
                px-6 py-3 rounded-full mx-2
                ${index === 0 ? "ml-4" : ""}
                ${index === interests.length - 1 ? "mr-4" : ""}
                ${
                  selectedInterest === interest ? "bg-slate-500" : "bg-gray-100"
                }
              `}
            >
              <Text
                className={`
                  text-base font-medium
                  ${
                    selectedInterest === interest
                      ? "text-white"
                      : "text-gray-700"
                  }
                `}
              >
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
