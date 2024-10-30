import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Paper } from '~/types/paper';
import { PaperModal } from '../papers/PaperModal';
import { useBookmarks } from '~/contexts/BookMarkContext';

interface CollectionPaperTileProps {
  paper: Paper;
  collectionId: string;
}

export const CollectionPaperTile = ({ paper, collectionId }: CollectionPaperTileProps) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const { removePaperFromCollection } = useBookmarks();

  const handleDelete = async () => {
    Alert.alert(
      'Remove Paper',
      'Are you sure you want to remove this paper from the collection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removePaperFromCollection(collectionId, paper.paperId);
            } catch (error) {
              Alert.alert('Error', 'Failed to remove paper from collection');
            }
          },
        },
      ]
    );
  };

  const renderAuthors = () => {
    if (!paper.authors || paper.authors.length === 0) return null;

    const authorNames = paper.authors
      .filter(author => author && author.name)
      .map(author => author.name);

    if (authorNames.length === 0) return null;

    const displayAuthors = authorNames.slice(0, 3);
    const hasMore = authorNames.length > 3;

    return (
      <Text className="text-sm text-gray-600">
        {displayAuthors.join(', ')}
        {hasMore ? ' et al.' : ''}
      </Text>
    );
  };

  const renderVenueAndYear = () => {
    if (!paper.venue && !paper.year) return null;

    return (
      <Text className="text-sm text-gray-500 mb-2">
        {paper.venue}
        {paper.venue && paper.year ? ' · ' : ''}
        {paper.year}
      </Text>
    );
  };

  return (
    <>
      <TouchableOpacity 
        onPress={() => setModalVisible(true)}
        className="bg-white rounded-lg shadow-sm p-4 mb-4"
      >
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 mr-2">
            <Text className="text-lg font-semibold">{paper.title}</Text>
          </View>
          <TouchableOpacity
            onPress={handleDelete}
            className="p-2"
          >
            <Feather name="trash-2" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
        
        <View className="flex-row items-center mb-2">
          {renderAuthors()}
        </View>
        
        {renderVenueAndYear()}
        
        {paper.abstract && (
          <Text numberOfLines={3} className="text-sm text-gray-700 mb-2">
            {paper.abstract}
          </Text>
        )}
         
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-gray-500">
            Citations: {paper.citationCount}
          </Text>
          <Feather name="chevron-right" size={16} color="#9ca3af" />
        </View>
      </TouchableOpacity>

      <PaperModal
        paper={paper}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};