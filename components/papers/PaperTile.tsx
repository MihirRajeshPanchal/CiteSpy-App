import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Paper } from '~/types/paper';
import { PaperModal } from './PaperModal';

interface PaperTileProps {
  paper: Paper;
}

export const PaperTile = ({ paper }: PaperTileProps) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const renderAuthors = () => {
    if (!paper.authors || paper.authors.length === 0) {
      return null;
    }

    const authorNames = paper.authors
      .filter(author => author && author.name)
      .map(author => author.name);

    if (authorNames.length === 0) {
      return null;
    }

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
    if (!paper.venue && !paper.year) {
      return null;
    }

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
        <Text className="text-lg font-semibold mb-2">{paper.title}</Text>
        
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