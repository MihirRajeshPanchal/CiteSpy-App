import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useBookmarks } from "~/contexts/BookMarkContext";
import * as Clipboard from "expo-clipboard";
import { CollectionPaperTile } from "./CollectionPaperTile";

export const BookmarkCollectionGrid = () => {
  const {
    collections,
    papers,
    createCollection,
    deleteCollection,
    editCollection,
    refreshCollections,
  } = useBookmarks();
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);

  useEffect(() => {
    refreshCollections();
  }, []);

  const handleCreateCollection = async () => {
    try {
      await createCollection(newCollectionName);
      setNewCollectionName("");
      setShowCreateModal(false);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Failed to create collection";
      Alert.alert("Error", errorMessage);
    }
  };

  const handleEditCollection = async () => {
    try {
      if (editingCollectionId) {
        await editCollection(editingCollectionId, newCollectionName);
        setNewCollectionName("");
        setShowEditModal(false);
        setEditingCollectionId(null);
      }
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Failed to edit collection";
      Alert.alert("Error", errorMessage);
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    try {
      await deleteCollection(collectionId);
      if (selectedCollection === collectionId) {
        setSelectedCollection(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete collection");
    }
  };

  const copyAllCitations = async (collectionId: string) => {
    const collectionPapers = papers[collectionId] || [];
    const citations = collectionPapers
      .map((paper) => paper.citationStyles?.["bibtex"] || "")
      .filter(Boolean)
      .join("\n\n");

    if (citations) {
      await Clipboard.setStringAsync(citations);
      Alert.alert("Success", "Citations copied to clipboard");
    } else {
      Alert.alert("Info", "No citations available");
    }
  };

  const openEditModal = (collectionId: string, currentName: string) => {
    setEditingCollectionId(collectionId);
    setNewCollectionName(currentName);
    setShowEditModal(true);
  };

  return (
    <View className="flex-1">
      <View className="p-4">
        <View className="mb-4">
          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            className="bg-black rounded-full flex-row items-center justify-center w-full p-4"
          >
            <Text className="text-white font-bold mr-2">
              Create New Collection
            </Text>
            <Feather name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView>
          {collections.map((collection) => (
            <TouchableOpacity
              key={collection.id}
              onPress={() => setSelectedCollection(collection.id)}
              className="bg-white rounded-lg p-4 shadow-sm mb-4"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Feather name="folder" size={24} color="#4B5563" />
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => openEditModal(collection.id, collection.name)}
                    className="p-2 mr-2"
                  >
                    <Feather name="edit" size={16} color="#4B5563" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteCollection(collection.id)}
                    className="p-2"
                  >
                    <Feather name="trash-2" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text className="text-lg font-semibold">{collection.name}</Text>
              <Text className="text-sm text-gray-600">
                {collection.paperCount} papers
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Modal
        visible={!!selectedCollection}
        animationType="slide"
        onRequestClose={() => setSelectedCollection(null)}
      >
        <View className="flex-1 bg-gray-50">
  <View className="bg-white px-4 py-3 flex-row items-center border-b border-gray-200">
    <TouchableOpacity
      onPress={() => setSelectedCollection(null)}
      className="p-2"
    >
      <Feather name="arrow-left" size={20} color="#4B5563" />
    </TouchableOpacity>
    <Text 
      className="text-xl font-semibold ml-4 max-w-[200px] truncate flex-1" 
      numberOfLines={1}
    >
      {collections.find((c) => c.id === selectedCollection)?.name}
    </Text>
    <View className="flex-row items-center">
      <TouchableOpacity
        onPress={() => copyAllCitations(selectedCollection!)}
        className="bg-gray-100 rounded-lg py-2 px-4 flex-row items-center space-x-2"
      >
        <Text className="text-gray-700">Copy All Citations</Text>
        <Feather name="copy" size={20} color="#4B5563" />
      </TouchableOpacity>
    </View>
  </View>

          <ScrollView className="flex-1 p-4">
            {(papers[selectedCollection!] || []).map((paper) => (
              <CollectionPaperTile
                key={paper.paperId}
                paper={paper}
                collectionId={selectedCollection!}
              />
            ))}
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <Text className="text-xl font-semibold mb-4">
              Create New Collection
            </Text>
            <TextInput
              value={newCollectionName}
              onChangeText={setNewCollectionName}
              placeholder="Collection name"
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />
            <View className="flex-row justify-end gap-2">
              <TouchableOpacity
                onPress={() => setShowCreateModal(false)}
                className="bg-gray-200 rounded-lg py-2 px-4"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateCollection}
                className="bg-gray-900 rounded-lg py-2 px-4"
              >
                <Text className="text-white">Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <Text className="text-xl font-semibold mb-4">
              Edit Collection
            </Text>
            <TextInput
              value={newCollectionName}
              onChangeText={setNewCollectionName}
              placeholder="Collection name"
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />
            <View className="flex-row justify-end gap-2">
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                className="bg-gray-200 rounded-lg py-2 px-4"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleEditCollection}
                className="bg-gray-900 rounded-lg py-2 px-4"
              >
                <Text className="text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
