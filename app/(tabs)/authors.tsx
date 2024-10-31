import { Stack } from "expo-router";
import { View } from "react-native";
import { AuthorSearch } from "~/components/authors/AuthorSearch";

export default function SearchAuthors() {
  return (
    <>
      <Stack.Screen options={{ title: "Search Authors" }} />
      <View className="flex-1">
        <AuthorSearch />
      </View>
    </>
  );
}
