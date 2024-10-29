import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function Profile() {
  return (
    <>
      <Stack.Screen options={{ title: 'My Profile' }} />
      <View style={styles.container}>
        <ScreenContent path="app/(tabs)/profile.tsx" title="My Profile" />
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
