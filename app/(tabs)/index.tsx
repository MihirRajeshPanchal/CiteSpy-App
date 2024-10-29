import { Stack } from 'expo-router';
import { View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <View className="flex-1">
        <ScreenContent path="app/(tabs)/index.tsx" title="Home" />
      </View>
    </>
  );
}
