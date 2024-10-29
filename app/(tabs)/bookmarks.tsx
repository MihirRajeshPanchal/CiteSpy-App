import { Stack } from 'expo-router';
import { View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function BookMarks() {
  return (
    <>
      <Stack.Screen options={{ title: 'Book Marks' }} />
      <View className="flex-1">
        <ScreenContent path="app/(tabs)/bookmarks.tsx" title="BookMarks" />
      </View>
    </>
  );
}
