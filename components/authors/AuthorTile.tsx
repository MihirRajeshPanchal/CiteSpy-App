import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Author } from '~/types/author';
import { AuthorModal } from './AuthorModal';
import { FollowButton } from './FollowButton';

interface AuthorTileProps {
  author: Author;
}

export const AuthorTile = ({ author }: AuthorTileProps) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const renderAffiliations = () => {
    if (!author.affiliations || author.affiliations.length === 0) {
      return null;
    }

    return (
      <Text className="text-sm text-gray-600 mb-2">
        {author.affiliations.join(', ')}
      </Text>
    );
  };

  const renderRecentPapers = () => {
    if (!author.papers || author.papers.length === 0) {
      return null;
    }

    const recentPapers = author.papers
      .sort((a, b) => (b.year || 0) - (a.year || 0))
      .slice(0, 5);

    return (
      <View className="mt-2">
        <Text className="text-sm font-medium mb-1">Recent Papers:</Text>
        {recentPapers.map((paper, index) => (
          <Text key={index} className="flex-row flex-wrap justify-center items-center gap-6 mb-4 bg-gray-50 p-4 rounded-lg" numberOfLines={100}>
            • {paper.title} ({paper.year || 'N/A'})
          </Text>
        ))}
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-white rounded-lg shadow-sm p-4 mb-4"
      >
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold flex-1 mr-2">{author.name}</Text>
          <FollowButton 
            authorId={author.authorId} 
            authorName={author.name}
            authorUrl={author.url}
          />
        </View>
        
        {renderAffiliations()}
        
        <View className="flex-row flex-wrap justify-center items-center gap-6 mb-4 bg-gray-50 p-4 rounded-lg">
        <View className="items-center">
          <Text className="text-sm font-medium text-gray-600">Total Papers</Text>
          <Text className="text-xl font-semibold">{author.paperCount}</Text>
        </View>
        <View className="items-center">
          <Text className="text-sm font-medium text-gray-600">Citations</Text>
          <Text className="text-xl font-semibold">{author.citationCount}</Text>
        </View>
        <View className="items-center">
          <Text className="text-sm font-medium text-gray-600">h-index</Text>
          <Text className="text-xl font-semibold">{author.hIndex}</Text>
        </View>
      </View>
        
        {renderRecentPapers()}
        
        <View className="flex-row items-center justify-end mt-2">
          <Feather name="chevron-right" size={16} color="#9ca3af" />
        </View>
      </TouchableOpacity>

      <AuthorModal
        author={author}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};  