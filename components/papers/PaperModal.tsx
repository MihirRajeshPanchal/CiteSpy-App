import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Paper } from '~/types/paper';

interface PaperModalProps {
  paper: Paper;
  visible: boolean;
  onClose: () => void;
}

export const PaperModal = ({ paper, visible, onClose }: PaperModalProps) => {
  const renderAuthors = () => {
    if (!paper.authors || paper.authors.length === 0) return null;
    const authorNames = paper.authors
      .filter(author => author && author.name)
      .map(author => author.name);
    return authorNames.join(', ');
  };

  const handleOpenLink = async () => {
    if (paper.url) {
      await Linking.openURL(paper.url);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color="#000" />
          </TouchableOpacity>
          {paper.url && (
            <TouchableOpacity onPress={handleOpenLink}>
              <Feather name="external-link" size={24} color="#000" />
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <ScrollView className="flex-1 p-4">
          <Text className="text-2xl font-bold mb-4">{paper.title}</Text>
          
          {renderAuthors() && (
            <View className="mb-4">
              <Text className="text-base font-semibold mb-1">Authors</Text>
              <Text className="text-gray-700">{renderAuthors()}</Text>
            </View>
          )}

          {(paper.venue || paper.year) && (
            <View className="mb-4">
              <Text className="text-base font-semibold mb-1">Publication</Text>
              <Text className="text-gray-700">
                {paper.venue}
                {paper.venue && paper.year ? ' · ' : ''}
                {paper.year}
              </Text>
            </View>
          )}

          {paper.abstract && (
            <View className="mb-4">
              <Text className="text-base font-semibold mb-1">Abstract</Text>
              <Text className="text-gray-700">{paper.abstract}</Text>
            </View>
          )}

          <View className="mb-4">
            <Text className="text-base font-semibold mb-1">Citations</Text>
            <Text className="text-gray-700">{paper.citationCount}</Text>
          </View>

          {paper.publicationTypes && paper.publicationTypes.length > 0 && (
            <View className="mb-4">
              <Text className="text-base font-semibold mb-1">Publication Type</Text>
              <Text className="text-gray-700">{paper.publicationTypes.join(', ')}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};