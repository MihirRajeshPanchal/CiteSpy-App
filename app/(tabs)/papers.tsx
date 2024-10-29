import { Stack } from 'expo-router';
import { View } from 'react-native';
import { PaperSearch } from '~/components/papers/PaperSearch';

export default function SearchPapers() {
  return (
    <>
      <Stack.Screen options={{ title: 'Search Papers' }} />
      <View className="flex-1">
        <PaperSearch />
      </View>
    </>
  );
}