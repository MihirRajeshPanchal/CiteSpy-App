import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function BookMarks() {
  return (
    <>
      <Stack.Screen options={{ title: 'Book Marks' }} />
      <View style={styles.container}>
        <ScreenContent path="app/(tabs)/bookmarks.tsx" title="BookMarks" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
