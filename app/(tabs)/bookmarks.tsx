import { Stack } from "expo-router";
import { View } from "react-native";
import { BookmarkCollectionGrid } from "~/components/bookmarks/BookmarkCollectionGrid";

export default function Bookmarks() {
  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ title: "Bookmarks" }} />
      <BookmarkCollectionGrid />
    </View>
  );
}
