import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { Paper } from "~/types/paper";
import { PaperModal } from "~/components/papers/PaperModal";

interface PaperCardProps {
  paper: Paper;
  onSwipe: (direction: "left" | "right") => void;
  style?: any;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.5;

export function PaperCard({ paper, onSwipe, style }: PaperCardProps) {
  if (!paper.abstract || paper.abstract.trim() === "") {
    return null;
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const translateX = useSharedValue(0);

  const springConfig = {
    damping: 20,
    stiffness: 400,
    mass: 1,
  };

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      translateX.value = withSpring(0, springConfig);
    },
    onActive: (event) => {
      const resistance = 0.5;
      translateX.value = event.translationX * resistance;
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        translateX.value = withSpring(
          event.translationX > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH,
          springConfig,
        );
        runOnJS(onSwipe)(event.translationX > 0 ? "right" : "left");
      } else {
        translateX.value = withSpring(0, springConfig);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleTextLayout = (event: any) => {
    const maxHeight = SCREEN_HEIGHT * 0.35;
    setIsTextTruncated(
      event.nativeEvent.lines.length > Math.floor(maxHeight / 20),
    );
  };

  return (
    <>
      <PanGestureHandler onGestureEvent={panGesture} activeOffsetX={[-10, 10]}>
        <Animated.View
          style={[
            {
              height: "100%",
              width: "100%",
            },
            style,
            animatedStyle,
          ]}
          className="bg-white rounded-xl shadow-xl"
        >
          <View className="flex-1 p-6">
            <Text className="text-2xl font-bold text-gray-800">
              {paper.title || "Untitled Paper"}
            </Text>

            <View className="space-y-2 mt-4">
              <Text className="font-semibold text-gray-700">Abstract</Text>
              <Text
                className="text-gray-600 leading-relaxed"
                numberOfLines={Math.floor((SCREEN_HEIGHT * 0.35) / 20)}
                onTextLayout={handleTextLayout}
              >
                {paper.abstract}
              </Text>
              {isTextTruncated && (
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  className="mt-2"
                >
                  <View className="flex-row items-center">
                    <Text className="text-slate-900 font-medium mr-1">
                      Read more
                    </Text>
                    <Feather name="chevron-right" size={16} color="#2563EB" />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
            className="absolute bottom-8 right-5 bg-slate-600 rounded-full p-3"
          >
            <Feather name="maximize-2" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>

      <PaperModal
        paper={paper}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}
