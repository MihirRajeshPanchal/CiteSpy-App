import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

interface InterestBubbleProps {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
  index: number;
}

const InterestBubble: React.FC<InterestBubbleProps> = ({ label, isSelected, onToggle, index }) => {
  const animatedValue = new Animated.Value(0);
  
  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
      delay: index * 100,
    }).start();
  }, []);

  const animatedStyle = {
    transform: [
      { scale: animatedValue },
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
    opacity: animatedValue,
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onToggle}
        className={`m-2 px-6 py-3 rounded-full border ${
          isSelected ? 'bg-gray-600 border-gray-700' : 'bg-gray-100 border-gray-200'
        }`}
        style={{
          shadowColor: isSelected ? '#3B82F6' : '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isSelected ? 0.3 : 0.1,
          shadowRadius: 4,
          elevation: isSelected ? 4 : 2,
        }}
      >
        <Text
          className={`text-base ${
            isSelected ? 'text-white' : 'text-gray-700'
          }`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const researchTopics = [
  'Artificial Intelligence',
  'Machine Learning',
  'Computer Vision',
  'Natural Language Processing',
  'Robotics',
  'Quantum Computing',
  'Cybersecurity',
  'Data Science',
  'Cloud Computing',
  'Internet of Things',
  'Blockchain',
  'Bioinformatics',
  'Human-Computer Interaction',
  'Software Engineering',
  'Computer Graphics',
];

export default function OnboardingScreen() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(item => item !== interest)
        : [...prev, interest]
    );
  };

  const handleComplete = async () => {
    if (selectedInterests.length === 0) {
      alert('Please select at least one research interest');
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      const userEmail = auth.currentUser?.email;

      if (!userId || !userEmail) {
        throw new Error('User not authenticated');
      }

      await setDoc(doc(db, 'user_interests', userId), {
        email: userEmail,
        interests: selectedInterests,
        updatedAt: new Date().toISOString(),
      });

      router.replace('/(tabs)');
    } catch (error) {
      alert('Error saving interests: ' + (error as Error).message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <StatusBar barStyle="dark-content" />
      <Animated.View 
        className="flex-1 px-4 py-6"
        style={{ opacity: fadeAnim }}
      >
        <View className="mb-8">
          <Text className="text-3xl font-bold text-center mb-3 text-gray-900">
            Research Interests
          </Text>
          <Text className="text-base text-center mb-2 text-gray-600">
            Select topics that interest you to personalize your feed
          </Text>
          <Text className="text-sm text-center text-gray-500">
            You can always change these later
          </Text>
        </View>

        <ScrollView 
          className="flex-1 mb-6"
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            paddingBottom: 20
          }}
          showsVerticalScrollIndicator={false}
        >
          {researchTopics.map((topic, index) => (
            <InterestBubble
              key={topic}
              label={topic}
              isSelected={selectedInterests.includes(topic)}
              onToggle={() => toggleInterest(topic)}
              index={index}
            />
          ))}
        </ScrollView>

        <View className="px-4 mb-6">
          <TouchableOpacity
            onPress={handleComplete}
            className={`rounded-xl py-4 px-6 ${
              selectedInterests.length > 0 ? 'bg-gray-900' : 'bg-gray-300'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 6,
            }}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Continue ({selectedInterests.length} selected)
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}