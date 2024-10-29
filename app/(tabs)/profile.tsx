import { Stack } from 'expo-router';
import { View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function Profile() {
  return (
    <>
      <Stack.Screen options={{ title: 'My Profile' }} />
      <View className="flex-1">
        <ScreenContent path="app/(tabs)/profile.tsx" title="My Profile" />
      </View>
    </>
  );
}
