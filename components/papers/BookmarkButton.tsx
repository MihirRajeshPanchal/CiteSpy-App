import { Feather } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useBookmarks } from "~/contexts/BookMarkContext";
import type { Paper } from "~/types/paper";

interface BookmarkButtonProps {
  paper: Paper;
  className?: string;
}

export const BookmarkButton = ({
  paper,
  className = "",
}: BookmarkButtonProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    collections,
    createCollection,
    addPaperToCollection,
    refreshCollections,
  } = useBookmarks();

  useEffect(() => {
    refreshCollections();
  }, []);

  const handleBookmark = async (collectionId: string) => {
    try {
      setIsLoading(true);
      await addPaperToCollection(collectionId, paper);
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to add paper to collection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDefaultCollection = async () => {
    try {
      setIsLoading(true);
      await createCollection("My Papers");
      const defaultCollection = collections[0];
      if (defaultCollection) {
        await handleBookmark(defaultCollection.id);
      }
    } catch (error) {
      console.error("Failed to create default collection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className={`p-2 rounded-full active:bg-gray-100 ${className}`}
      >
        <Feather name="bookmark" size={24} color="black" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <Text className="text-xl font-semibold mb-4">
              Save to Collection
            </Text>

            {isLoading ? (
              <View className="py-8">
                <ActivityIndicator size="large" color="#4B5563" />
              </View>
            ) : collections.length === 0 ? (
              <View>
                <Text className="text-gray-600 mb-4">
                  No collections found. Would you like to create one?
                </Text>
                <TouchableOpacity
                  onPress={handleCreateDefaultCollection}
                  className="bg-gray-900 rounded-lg py-3 px-4 mb-4"
                >
                  <Text className="text-white text-center font-medium">
                    Create "My Papers" Collection
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="mb-4">
                {collections.map((collection) => (
                  <TouchableOpacity
                    key={collection.id}
                    onPress={() => handleBookmark(collection.id)}
                    className="py-3 px-4 border-b border-gray-200 active:bg-gray-50"
                  >
                    <Text className="text-lg">{collection.name}</Text>
                    <Text className="text-sm text-gray-600">
                      {collection.paperCount} papers
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-gray-200 rounded-lg py-2 px-4 active:bg-gray-300"
            >
              <Text className="text-center font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};
