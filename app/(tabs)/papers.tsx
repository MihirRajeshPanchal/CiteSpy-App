import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function SearchPapers() {
  return (
    <>
      <Stack.Screen options={{ title: 'Search Papers' }} />
      <View style={styles.container}>
        <ScreenContent path="app/(tabs)/paper.tsx" title="Search Papers" />
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
