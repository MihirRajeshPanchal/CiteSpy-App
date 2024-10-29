import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function SearchAuthors() {
  return (
    <>
      <Stack.Screen options={{ title: 'Search Authors' }} />
      <View style={styles.container}>
        <ScreenContent path="app/(tabs)/authors.tsx" title="Search Authors" />
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
